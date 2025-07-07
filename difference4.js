const EDIT = 1 << 16;
const STREAKEND = 1;

export function levenshteinMinimalShifts(A, B) {
  const H = A.length, W = B.length, H2 = H + 1, W2 = W + 1;
  const res = new Uint32Array(H2 * W2);
  for (let i = 1; i <= W2; i++) res[i] = i * EDIT + (i - 1) * STREAKEND;
  for (let i = 1; i <= H2; i++) res[i * W2] = i * EDIT + (i - 1) * STREAKEND;
  for (let y1 = 0, y2 = 1; y1 < H; y1++, y2++)
    for (let x1 = 0, x2 = 1; x1 < W; x1++, x2++)
      res[y2 * W2 + x2] = Math.min(
        res[y1 * W2 + x2] + EDIT + STREAKEND,
        res[y2 * W2 + x1] + EDIT + STREAKEND,
        res[y1 * W2 + x1] + (A[y1] != B[x1] ? EDIT + STREAKEND : A[y2] != B[x2] || y2 == H ? STREAKEND : 0)
      );
  return res;
}

export function* backtrace(table, A, B) {
  const W = B.length + 1;
  let n = table.length - 1;
  while (n > 0) {
    const y = Math.floor(n / W);
    const x = n % W;
    let a = A[y - 1];
    let b = B[x - 1];
    const now = table[n];
    let type;
    if (y == 0)
      type = "add";
    else if (x == 0)
      type = "del";
    else {
      let upLeft = table[n - W - 1];
      if (upLeft == now) {
        type = "match";
      } else {
        const up = table[n - W];
        const left = table[n - 1];
        upLeft -= EDIT;
        if (up <= left && up <= upLeft)
          type = "del";
        else if (left <= up && left <= upLeft)
          type = "add";
        else if (a == b)
          type = "match";
        else
          type = "cross";
      }
    }
    if (type == "add") a = "";
    if (type == "del") b = "";
    yield { type, now, n, x, y, a, b };
    if (type != "del") n -= 1;
    if (type != "add") n -= W;
  }
}

export function diff(A, B) {
  let p, res = [];
  for (let { a, b } of backtrace(levenshteinMinimalShifts(A, B), A, B))
    p && (p.a === p.b) === (a === b) ?
      ((p.a = a + p.a), (p.b = b + p.b)) :
      res.unshift(p = { a, b });
  return res;
}

export function diffArray(A, B) {
  let p, res = [];
  for (let { a, b } of backtrace(levenshteinMinimalShifts(A, B), A, B))
    p && (p.a === p.b) === (a === b) ?
      (p.a.unshift(a), p.b.unshift(b)) :
      res.unshift(p = { a: [a], b: [b] });
  return res;
}