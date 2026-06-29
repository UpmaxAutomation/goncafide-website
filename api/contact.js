/**
 * Vercel Node.js serverless function — /api/contact
 *
 * Handles both the contact form ("iletisim") and newsletter opt-in.
 * Delivery sinks are opt-in via environment variables; the function
 * never crashes if they are absent.
 *
 * Env vars (set in Vercel → Project → Settings → Environment Variables):
 *   GHL_CONTACT_WEBHOOK  — GoHighLevel webhook URL for lead capture
 *   RESEND_API_KEY       — Resend.com API key for email notifications
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Very basic RFC-5322-ish email check — good enough for a contact form. */
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Parse the request body regardless of content-type.
 * Vercel auto-populates req.body for common content types when the runtime
 * parses it, but we guard defensively for string payloads too.
 */
function parseBody(req) {
  const raw = req.body;

  if (raw === undefined || raw === null) return {};

  // Already an object (Vercel parsed it)
  if (typeof raw === "object" && !Buffer.isBuffer(raw)) return raw;

  // String — could be JSON or URL-encoded
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("{")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        // fall through to URLSearchParams
      }
    }
    // URL-encoded
    const params = new URLSearchParams(trimmed);
    const out = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  }

  // Buffer (rare on Vercel, but safe to handle)
  if (Buffer.isBuffer(raw)) {
    const str = raw.toString("utf8").trim();
    if (str.startsWith("{")) {
      try {
        return JSON.parse(str);
      } catch { /* fall through */ }
    }
    const params = new URLSearchParams(str);
    const out = {};
    for (const [k, v] of params.entries()) out[k] = v;
    return out;
  }

  return {};
}

/**
 * Resolve whether the caller wants JSON back (AJAX) or a redirect (HTML form).
 */
function wantsJson(req) {
  const accept = req.headers?.accept || req.headers?.Accept || "";
  return accept.includes("application/json");
}

// ---------------------------------------------------------------------------
// Delivery sinks  (all non-fatal — capture-and-log on failure)
// ---------------------------------------------------------------------------

/**
 * POST lead data to a GoHighLevel webhook.
 */
async function sendToGHL(fields) {
  const url = process.env.GHL_CONTACT_WEBHOOK;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, source: "goncafide.com" }),
    });
    if (!res.ok) {
      console.error(`[contact] GHL webhook non-2xx: ${res.status}`);
    }
  } catch (err) {
    console.error("[contact] GHL webhook error:", err?.message ?? err);
  }
}

/**
 * Send an email notification via Resend.
 * https://resend.com/docs/api-reference/emails/send-email
 */
async function sendViaResend(fields) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { name, email, phone, program, message, formType, community } = fields;

  const subject =
    formType === "newsletter"
      ? `Bülten kaydı: ${email}`
      : formType === "topluluk"
        ? `Topluluk kaydı: ${community || "—"} — ${name || email}`
        : `Yeni iletişim formu: ${name ?? email}`;

  const html = `
    <h2>Yeni form gönderimi — ${formType ?? "bilinmiyor"}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><th align="left">Ad:</th><td>${name ?? "—"}</td></tr>
      <tr><th align="left">E-posta:</th><td>${email}</td></tr>
      <tr><th align="left">Telefon:</th><td>${phone ?? "—"}</td></tr>
      <tr><th align="left">Topluluk:</th><td>${community || "—"}</td></tr>
      <tr><th align="left">Program:</th><td>${program ?? "—"}</td></tr>
      <tr><th align="left">Mesaj:</th><td style="white-space:pre-wrap">${message ?? "—"}</td></tr>
    </table>
  `.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Gonca Fide Web <web@goncafide.com>",
        to: ["info@goncafide.com"],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[contact] Resend non-2xx: ${res.status}`, body);
    }
  } catch (err) {
    console.error("[contact] Resend error:", err?.message ?? err);
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = parseBody(req);

  // ------------------------------------------------------------------
  // Honeypot — bots fill the hidden `bot-field`; humans don't see it.
  // Silently succeed (don't let bots know they were caught).
  // ------------------------------------------------------------------
  if (body["bot-field"]) {
    if (wantsJson(req)) {
      res.status(200).json({ ok: true });
    } else {
      res.writeHead(303, { Location: "/tesekkurler" });
      res.end();
    }
    return;
  }

  // Normalize field values (trim strings, coerce to string)
  const str = (v) => (typeof v === "string" ? v.trim() : "");

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const program = str(body.program);
  const message = str(body.message);
  const community = str(body.community);
  // Support both a custom `formType` field and the Netlify-style `form-name`
  const formType = str(body.formType) || str(body["form-name"]) || "iletisim";

  // ------------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------------
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Geçerli bir e-posta adresi giriniz." });
    return;
  }

  if (formType !== "newsletter") {
    // All non-newsletter forms require a name
    if (!name) {
      res.status(400).json({ error: "Ad alanı zorunludur." });
      return;
    }
    // Only the contact form requires a message; the topluluk waitlist does not
    if (formType !== "topluluk" && !message) {
      res.status(400).json({ error: "Mesaj alanı zorunludur." });
      return;
    }
  }

  // ------------------------------------------------------------------
  // Delivery — fire both sinks concurrently; errors are non-fatal
  // ------------------------------------------------------------------
  const fields = { name, email, phone, program, message, formType, community };

  await Promise.all([sendToGHL(fields), sendViaResend(fields)]);

  // ------------------------------------------------------------------
  // Response
  // ------------------------------------------------------------------
  if (wantsJson(req)) {
    res.status(200).json({ ok: true });
  } else {
    res.writeHead(303, { Location: "/tesekkurler" });
    res.end();
  }
}
