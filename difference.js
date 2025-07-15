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

export function backtrace(table, A, B) {
  const W = B.length + 1;
  let n = table.length - 1;
  let res = [], mn, ma, md;
  while (n > 0) {
    const y = Math.floor(n / W) - 1;
    const x = (n % W) - 1;
    const a = A[y];
    const b = B[x];
    const now = table[n];
    let type;
    if (y < 0)
      type = "add";
    else if (x < 0)
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
    type == "match" ?
      ma = md = undefined :
      mn = undefined;

    if (type === "match")
      mn ? (mn.i++, mn.x = x, mn.y = y) :
        res.unshift(mn = { type, x, y, i: 1 });
    if (type === "add" || type === "cross")
      ma ? (ma.i++, ma.x = x) :
        res.unshift(ma = { type: "add", x, y, i: 1 });
    if (type === "del" || type === "cross")
      md ? (md.i++, md.y = y) :
        res.unshift(md = { type: "del", x, y, i: 1 });
    if (md && type === "add" || type === "cross")
      md.x = x - 1;

    if (type != "del") n -= 1;
    if (type != "add") n -= W;
  }
  return res;
}

function hackFix(res) {
  if (res.length !== 3) return;
  if (res[1].a !== res[1].b) return;
  if (!res[0].b.length && !res[2].b.length && JSON.stringify(res[1].a) === JSON.stringify(res[2].a))
    return (res[0].a = res[0].a.concat(res[2].a)), res.slice(0, 2);
  if (!res[0].a.length && !res[2].a.length && JSON.stringify(res[1].b) === JSON.stringify(res[2].b))
    return (res[0].b = res[0].b.concat(res[2].b)), res.slice(0, 2);
}

export function diffRaw(A, B) {
  if (!A.length && !B.length) return [];
  if (!A.length) return [{ type: "add", x: 0, y: 0, i: B.length, a: A, b: B }];
  if (!B.length) return [{ type: "del", x: 0, y: 0, i: A.length, a: A, b: B }];
  const res = backtrace(levenshteinMinimalShifts(A, B), A, B);
  const empty = A instanceof Array || B instanceof Array ? Object.freeze([]) : "";
  for (let d of res) {
    d.a = d.type === "add" ? empty : A.slice(d.y, d.y + d.i);
    d.b = d.type === "del" ? empty : B.slice(d.x, d.x + d.i);
  }
  return hackFix(res) ?? res;
}

function secondStep(diffs) {
  const diffs2 = diffs.flatMap(p => p.a === p.b || !p.a || !p.b ? p : diffRaw(p.a, p.b));

  const diffs3 = [];
  let last = diffs3[0] = diffs2[0];
  for (let i = 1; i < diffs2.length; i++) {
    const n = diffs2[i];
    if ((n.a === n.b) === (last.a === last.b))
      ((last.a = last.a.concat(n.a)), (last.b = last.b.concat(n.b)));
    else
      diffs3.push(last = n);
  }
  return diffs3;
}

export function diff(A, B) {
  if (A instanceof Array || B instanceof Array || (A.length * B.length) < 1_000_000)
    return diffRaw(A, B);
  throw new Error("omg");
  const Aw = A.split(/\b/), Bw = B.split(/\b/);
  if ((Aw.length * Bw.length) < 1_000_000)
    return secondStep(diffRaw(Aw, Bw));
  //todo untested..
  return secondStep(diffRaw(A.split(/(\r?\n)/), B.split(/(\r?\n)/)));
}