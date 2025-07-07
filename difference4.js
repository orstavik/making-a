const EDIT = 1 << 16;
const STREAKEND = 1;

export function levenshteinMinimalShifts(A, B) {
  const H = A.length, W = B.length, H2 = H + 1, W2 = W + 1;
  const table = new Uint32Array(H2 * W2);
  for (let i = 1; i <= W2; i++) table[i] = i * EDIT + (i - 1) * STREAKEND;
  for (let i = 1; i <= H2; i++) table[i * W2] = i * EDIT + (i - 1) * STREAKEND;
  for (let y1 = 0, y2 = 1; y1 < H; y1++, y2++)
    for (let x1 = 0, x2 = 1; x1 < W; x1++, x2++)
      table[y2 * W2 + x2] = Math.min(
        table[y1 * W2 + x2] + EDIT + STREAKEND,
        table[y2 * W2 + x1] + EDIT + STREAKEND,
        table[y1 * W2 + x1] + (A[y1] != B[x1] ? EDIT + STREAKEND : A[y2] != B[x2] || y2 == H ? STREAKEND : 0)
      );
  return table;
}

export function* backtrace(table, A, B) {
  const W = B.length + 1;
  let n = table.length - 1;
  while (n >= 0) {
    const y = Math.floor(n / W);
    const x = n % W;
    let a = A[y - 1];
    let b = B[x - 1];
    const now = table[n];
    let type;
    if (n == 0)
      type = "end";
    else if (y == 0)
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

function unshiftStr(last, a, b) {
  last.a = a + last.a;
  last.b = b + last.b;
}

export function diff(A, B) {
  const table = levenshteinMinimalShifts(A, B);
  const iter = backtrace(table, A, B);
  const res = []; let last;
  for (let p of iter) {
    const { a, b } = p;
    if (!a && !b) continue;
    if (last && ((last.a == last.b && a == b) || (last.a != last.b && a != b)))
      (last.a = a + last.a), (last.b = b + last.b);
    else
      res.unshift(last = p);
  }
  return res;
}