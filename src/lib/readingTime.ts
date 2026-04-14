export function readingTime(content: string): string {
  const wpm = 200; // Turkish average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wpm);
  return `${minutes} dk okuma`;
}
