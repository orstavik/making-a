const EDIT = 1 << 16;
const STREAKEND = 1;

export function levenshteinMinimalShifts(A, B) {
  const H = A.length, W = B.length, H2 = H + 1, W2 = W + 1;
  const res = new Uint32Array(H2 * W2);
  for (let i = 1; i < W2; i++) res[i] = i * EDIT + (i - 1) * STREAKEND;
  for (let i = 1; i < H2; i++) res[i * W2] = i * EDIT + (i - 1) * STREAKEND;
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

export function diffRaw(A, B) {
  if (!A.length && !B.length) return [];
  if (!A.length || !B.length) return [{ a: A, b: B }];
  let p, res = [];
  for (let { a, b } of backtrace(levenshteinMinimalShifts(A, B), A, B))
    p && (p.a === p.b) === (a === b) ?
      ((p.a = a + p.a), (p.b = b + p.b)) :
      res.unshift(p = { a, b });
  return res;
}

function mostCommonCharRegex(str) {
  let freq = {}, winner = '', winnerVal = 0;
  for (let c of str) {
    const n = freq[c] = (freq[c] || 0) + 1;
    if (n > winnerVal)
      (winner = c), (winnerVal = n);
  }
  return winner.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s/g, '\\s');
}

function findStartEnd(a, b) {
  let start = 0, end = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  while (end < a.length - start && end < b.length - start && a[a.length - end - 1] === b[b.length - end - 1]) end++;
  return { start, end };
}

function extractUnions(res) {
  res[0].a !== res[0].b && res.unshift({ a: "", b: "" });
  res.at(-1).a !== res.at(-1).b && res.push({ a: "", b: "" });
  for (let i = 1; i < res.length; i += 2) {
    const { a, b } = res[i];
    const { start, end } = findStartEnd(a, b);
    if (start) {
      res[i - 1].a += a.slice(0, start);
      res[i - 1].b += b.slice(0, start);
    }
    if (end) {
      res[i + 1].a = a.slice(a.length - end) + res[i + 1].a;
      res[i + 1].b = b.slice(b.length - end) + res[i + 1].b;
    }
    if (start || end) {
      res[i].a = a.slice(start, a.length - end);
      res[i].b = b.slice(start, b.length - end);
    }
  }
  !res[0].a && !res[0].b && res.shift();
  !res.at(-1).a && !res.at(-1).b && res.pop();
  return res;
}

export function diff(A, B) {
  if ((A.length * B.length) < 1_000_000)
    return diffRaw(A, B);
  const regEx = new RegExp(`(${mostCommonCharRegex(A)}+)`, "g");
  const AA = A.split(regEx);
  const BB = B.split(regEx);
  !AA[0] && AA.shift();
  !BB[0] && BB.shift();
  !AA.at(-1) && AA.pop();
  !BB.at(-1) && BB.pop();
  const res = diffRaw(AA, BB);
  return extractUnions(res);
}