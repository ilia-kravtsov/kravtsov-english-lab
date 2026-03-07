export function norm(s: string) {
  return s.trim();
}

export function uniqNonEmpty(values: string[]) {
  const set = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const x = norm(v);
    if (!x) continue;
    if (set.has(x)) continue;
    set.add(x);
    out.push(x);
  }
  return out;
}

export function round(n: number) {
  return Math.round(n);
}
