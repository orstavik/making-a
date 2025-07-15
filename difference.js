const EDIT = 1 << 16;
const STREAKEND = 1;
const EDITSTREAK = EDIT + STREAKEND;

export function levenshteinMinimalShifts(A, B) {
  const H = A.length, W = B.length, H2 = H + 1, W2 = W + 1;
  const res = new Uint32Array(H2 * W2);
  for (let i = 1; i < W2; i++) res[i] = i * EDITSTREAK;
  for (let i = 1; i < H2; i++) res[i * W2] = i * EDITSTREAK;
  for (let y1 = 0, y2 = 1; y1 < H; y1++, y2++)
    for (let x1 = 0, x2 = 1; x1 < W; x1++, x2++)
      res[y2 * W2 + x2] = Math.min(
        res[y1 * W2 + x2] + EDITSTREAK,
        res[y2 * W2 + x1] + EDITSTREAK,
        A[y1] == B[x1] ? res[y1 * W2 + x1] + (A[y2] != B[x2] || y2 == H || x2 == W ? STREAKEND : 0) : Infinity
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
  if (res.length === 3 && !res[0].b && !res[2].b && res[1].a === res[1].b && res[1].a === res[2].a)
    return (res[0].a += res[2].a), res.slice(0, 2);
  if (res.length === 3 && !res[0].a && !res[2].a && res[1].a === res[1].b && res[1].a === res[2].b)
    return (res[0].b += res[2].b), res.slice(0, 2);
  return res;
}

function secondStep(diffs) {
  const diffs2 = diffs.flatMap(p =>
    p.a === p.b || !p.a || !p.b ? p :
      diffRaw(p.a, p.b));

  const diffs3 = [];
  let last = diffs3[0] = diffs2[0];
  for (let i = 1; i < diffs2.length; i++) {
    const n = diffs2[i];
    if ((n.a === n.b) === (last.a === last.b)) {
      last.a += n.a;
      last.b += n.b;
    } else {
      diffs3.push(last = n);
    }
  }
  return diffs3;
}

function thirdStep(diffs) {
  return diffs.flatMap(p => p.a && p.b && p.a !== p.b ? [{ a: p.a, b: "" }, { a: "", b: p.b }] : p);
}

export function diff(A, B) {
  if ((A.length * B.length) < 1_000_000)
    return thirdStep(diffRaw(A, B));
  const Aw = A.split(/\b/), Bw = B.split(/\b/);
  if ((Aw.length * Bw.length) < 1_000_000)
    return thirdStep(secondStep(diffRaw(Aw, Bw)));
  //todo untested..
  return thirdStep(secondStep(diffRaw(A.split(/(\r?\n)/), B.split(/(\r?\n)/))));
}