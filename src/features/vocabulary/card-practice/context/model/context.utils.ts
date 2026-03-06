export function norm(s: string) {
  return s.trim().toLowerCase();
}

export function round(n: number) {
  return Math.round(n);
}

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function pickContextExample(
  value: string,
  examples: string[],
): { example: string; masked: string } | null {
  const v = value.trim();
  if (!v) return null;
  if (!examples.length) return null;

  const re = new RegExp(`\\b${escapeRegExp(v)}\\b`, 'i');

  for (const ex of examples) {
    const raw = ex.trim();
    if (!raw) continue;
    if (!re.test(raw)) continue;
    const masked = raw.replace(re, '_____');
    return { example: raw, masked };
  }

  return null;
}
