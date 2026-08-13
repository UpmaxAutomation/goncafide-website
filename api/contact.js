/**
 * Vercel Node.js serverless function — /api/contact
 *
 * Handles both the contact form ("iletisim") and newsletter opt-in.
 * Delivery sinks are opt-in via environment variables; the function
 * never crashes if they are absent.
 *
 * Env vars (set in Vercel → Project → Settings → Environment Variables):
 *   WEB3FORMS_ACCESS_KEY — Web3Forms access key; delivers submissions to NOTIFY_EMAIL
 *   GHL_CONTACT_WEBHOOK  — GoHighLevel webhook URL for lead capture
 *   RESEND_API_KEY       — Resend.com API key for email notifications
 *   NOTIFY_EMAIL         — override the notification recipient (optional)
 *
 * At least one sink must be configured, otherwise submissions are rejected with
 * a 502 rather than silently accepted and dropped.
 */

/** Where form submissions are emailed. Override via env without a redeploy. */
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "goncaf@gmail.com";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Very basic RFC-5322-ish email check — good enough for a contact form. */
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Parse a multipart/form-data payload into a plain object.
 *
 * The Vercel Node runtime only parses JSON and URL-encoded bodies; multipart
 * arrives as an unparsed Buffer. Our own forms post URL-encoded, but a browser
 * running a cached older bundle — or any hand-rolled client — may still send
 * multipart, and losing those submissions silently is worse than the ~15 lines
 * it costs to read them. Text fields only; the forms upload no files.
 */
function parseMultipart(text, contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  if (!match) return null;

  const boundary = (match[1] || match[2]).trim();
  const out = {};

  for (const part of text.split(`--${boundary}`)) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const name = /name="([^"]*)"/i.exec(part.slice(0, headerEnd));
    if (!name) continue;

    out[name[1]] = part.slice(headerEnd + 4).replace(/\r\n$/, "");
  }

  return out;
}

/**
 * Parse the request body regardless of content-type.
 * Vercel auto-populates req.body for common content types when the runtime
 * parses it, but we guard defensively for string payloads too.
 */
function parseBody(req) {
  const raw = req.body;
  const contentType = req.headers?.["content-type"] ?? "";

  if (raw === undefined || raw === null) return {};

  // Already an object (Vercel parsed it)
  if (typeof raw === "object" && !Buffer.isBuffer(raw)) return raw;

  // Multipart — never parsed by the runtime, so decode it ourselves
  if (contentType.includes("multipart/form-data")) {
    const text = Buffer.isBuffer(raw) ? raw.toString("utf8") : String(raw);
    const parsed = parseMultipart(text, contentType);
    if (parsed) return parsed;
  }

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
// Delivery sinks
//
// Each returns true only if the submission was actually accepted downstream.
// An unconfigured sink returns false — the caller needs at least one success
// before it tells the visitor their message went through.
// ---------------------------------------------------------------------------

/** Subject line shared by the email sinks. */
function subjectFor({ formType, name, email, community }) {
  if (formType === "newsletter") return `Bülten kaydı: ${email}`;
  if (formType === "topluluk") return `Topluluk kaydı: ${community || "—"} — ${name || email}`;
  return `Yeni iletişim formu: ${name || email}`;
}

/**
 * Deliver the submission as email via Web3Forms.
 * The access key is bound to the destination inbox on web3forms.com, so the
 * recipient is configured there rather than here. https://docs.web3forms.com
 */
async function sendViaWeb3Forms(fields) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return false;

  const { name, email, phone, program, message, formType, community } = fields;

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: subjectFor(fields),
        from_name: "goncafide.com",
        // Lets Gonca hit "reply" and answer the visitor directly.
        replyto: email,
        "Ad Soyad": name || "—",
        "E-posta": email,
        "Telefon": phone || "—",
        "Program": program || "—",
        "Topluluk": community || "—",
        "Mesaj": message || "—",
        "Form tipi": formType,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[contact] Web3Forms non-2xx: ${res.status}`, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] Web3Forms error:", err?.message ?? err);
    return false;
  }
}

/**
 * POST lead data to a GoHighLevel webhook.
 */
async function sendToGHL(fields) {
  const url = process.env.GHL_CONTACT_WEBHOOK;
  if (!url) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, source: "goncafide.com" }),
    });
    if (!res.ok) {
      console.error(`[contact] GHL webhook non-2xx: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] GHL webhook error:", err?.message ?? err);
    return false;
  }
}

/**
 * Send an email notification via Resend.
 * https://resend.com/docs/api-reference/emails/send-email
 */
async function sendViaResend(fields) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const { name, email, phone, program, message, formType, community } = fields;

  const subject = subjectFor(fields);

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
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[contact] Resend non-2xx: ${res.status}`, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] Resend error:", err?.message ?? err);
    return false;
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
  // Delivery — fire every sink concurrently, then require at least one to
  // have succeeded. Reporting success on a message that reached nobody is
  // the worst outcome here: the visitor walks away believing they wrote in.
  // ------------------------------------------------------------------
  const fields = { name, email, phone, program, message, formType, community };

  const results = await Promise.all([
    sendViaWeb3Forms(fields),
    sendToGHL(fields),
    sendViaResend(fields),
  ]);

  if (!results.some(Boolean)) {
    console.error("[contact] No delivery sink succeeded — submission dropped:", {
      formType,
      email,
    });
    res.status(502).json({
      error: "Mesaj şu anda iletilemedi. Lütfen doğrudan info@goncafide.com adresine yazın.",
    });
    return;
  }

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
