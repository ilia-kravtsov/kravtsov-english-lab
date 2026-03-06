export function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
