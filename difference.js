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
    if (type == "cross") {
      yield { type: "del", now, n, x, y, a, b: "" };
      yield { type: "add", now, n, x, y, a: "", b };
    } else {
      yield { type, now, n, x, y, a, b };
    }
    if (type != "del") n -= 1;
    if (type != "add") n -= W;
  }
}

export function diffRaw(A, B) {
  if (!A.length && !B.length) return [];
  if (!A.length) return [{ type: "add", x: 0, y: 0, i: B.length, a: A, b: B }];
  if (!B.length) return [{ type: "del", x: 0, y: 0, i: A.length, a: A, b: B }];
  const res = backtrace2(levenshteinMinimalShifts(A, B), A, B);
  const empty = A instanceof Array || B instanceof Array ? Object.freeze([]) : "";
  for (let d of res) {
    d.aa = d.type === "add" ? empty : A.slice(d.y, d.y + d.i);
    d.bb = d.type === "del" ? empty : B.slice(d.x, d.x + d.i);
    d.a = d.aa instanceof Array ? d.aa.join("") : d.aa;
    d.b = d.bb instanceof Array ? d.bb.join("") : d.bb;
  }
  if (res.length === 3 && !res[0].b && !res[2].b && res[1].a === res[1].b && res[1].a === res[2].a)
    return (res[0].a = res[0].a.concat(res[2].a)), (res[0].aa = res[0].aa.concat(res[2].aa)), res.slice(0, 2);
  if (res.length === 3 && !res[0].a && !res[2].a && res[1].a === res[1].b && res[1].a === res[2].b)
    return (res[0].b = res[0].b.concat(res[2].b)), (res[0].bb = res[0].bb.concat(res[2].bb)), res.slice(0, 2);
  return res;
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
  const Aw = A.split(/\b/), Bw = B.split(/\b/);
  if ((Aw.length * Bw.length) < 1_000_000)
    return secondStep(diffRaw(Aw, Bw));
  //todo untested..
  return secondStep(diffRaw(A.split(/(\r?\n)/), B.split(/(\r?\n)/)));
}


export function backtrace2(table, A, B) {
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
    if (type === "add") {
      md && (md.x = x - 1);
      ma ? (ma.i++, ma.x = x) : //, ma.y = y
        res.unshift(ma = { type: "add", x, y, i: 1 });
    }
    if (type === "del")
      md ? (md.i++, md.y = y) : // md.x = x, 
        res.unshift(md = { type: "del", x, y, i: 1 });
    if (type === "cross") {
      // debugger
      ma ? (ma.i++, ma.x = x) : //, ma.y = y
        res.unshift(ma = { type: "add", x, y, i: 1 });
      md ? (md.i++, md.x = x - 1, md.y = y) :
        res.unshift(md = { type: "del", x: x - 1, y, i: 1 });
    }
    // if (type === "cross") {
    //   debugger
    //   ma.y += md.i - 1;
    // 
    // ma ? (ma.i++, ma.x = x) :
    //   res.unshift(ma = { type: "add", x, y, i: 1 });
    // md ? (md.i++, md.x = x - 1, md.y = y) :
    //   res.unshift(md = { type: "del", x: x - 1, y, i: 1 });
    // }

    if (type != "del") n -= 1;
    if (type != "add") n -= W;
  }
  return res;
}