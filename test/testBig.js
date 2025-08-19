const tstString = `export function levenshteinMinimalShifts(A, B) {
  const H = A.length, W = B.length, H2 = H + 1, W2 = W + 1, L = H2 * W2;
  const edits = new Uint16Array(L);
  const shifts = new Uint16Array(L);
  const state = new Uint8Array(L);  // 0: diagonal (match), 1: left (insert), 2: up (delete), 3: start

  edits[0] = 0; shifts[0] = 0; state[0] = 3;

  for (let x2 = 1; x2 < W2; x2++) {
    edits[x2] = x2;
    shifts[x2] = 1;
    state[x2] = 1;
  }
  for (let y2 = 1, idx = y2 * W2; y2 < H2; y2++, idx = y2 * W2) {
    edits[idx] = y2;
    shifts[idx] = 1;
    state[idx] = 2;
  }

  for (let y1 = 0, y2 = 1; y1 < H; y1++, y2++) {
    for (let x1 = 0, x2 = 1; x1 < W; x1++, x2++) {
      const idx = y2 * W2 + x2;
      const left = y2 * W2 + x1;
      const up = y1 * W2 + x2;
      const upLeft = y1 * W2 + x1;

      const diagEdits = (A[y1] !== B[x1]) ? Infinity : edits[upLeft];
      const leftEdits = edits[left] + 1;
      const upEdits = edits[up] + 1;

      const diagShifts = shifts[upLeft] + (state[upLeft] !== 0);
      const leftShifts = shifts[left] + (state[left] !== 1);
      const upShifts = shifts[up] + (state[up] !== 2);

      let bestEdits = diagEdits;
      let bestShifts = diagShifts;
      let bestState = 0;

      if (leftEdits < bestEdits || (leftEdits === bestEdits && leftShifts < bestShifts)) {
        bestEdits = leftEdits;
        bestShifts = leftShifts;
        bestState = 1;
      }
      if (upEdits < bestEdits || (upEdits === bestEdits && upShifts < bestShifts)) {
        bestEdits = upEdits;
        bestShifts = upShifts;
        bestState = 2;
      }

      edits[idx] = bestEdits;
      shifts[idx] = bestShifts;
      state[idx] = bestState;
    }
  }

  const res = new Uint32Array(L);
  for (let i = 0; i < L; i++) res[i] =
    (edits[i] << 16) | state[i];
  return res;
}

export function backtrace(table, A, B) {
  const W = B.length + 1;
  let n = table.length - 1;
  let res = [], match, ins, del;
  while (n > 0) {
    const y = Math.floor(n / W) - 1;
    const x = (n % W) - 1;
    const a = A[y];
    const b = B[x];
    let type;
    if (y < 0)
      type = "ins";
    else if (x < 0)
      type = "del";
    else {
      const now = table[n];
      const nowDirection = now & 0xF;
      if (!nowDirection) {
        type = "match";
      } else if (nowDirection === 1) {
        type = "ins";
      } else if (nowDirection === 2) {
        type = "del";
      }
    }
    type == "match" ? ins = del = undefined : match = undefined;

    if (type === "match")
      match ? (match.x--, match.y--, match.i++) :
        res.unshift(match = { type, x, y, i: 1 });
    else if (type === "ins")
      ins ? (ins.x--, ins.i++) :
        res.unshift(ins = { type: "ins", x, y, i: 1 });
    else if (type === "del")
      del ? (del.y--, del.i++) :
        res.unshift(del = { type: "del", x, y, i: 1 });

    if (type != "del") n -= 1;
    if (type != "ins") n -= W;
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
  if (!A.length) return [{ type: "ins", x: 0, y: 0, i: B.length, a: A, b: B }];
  if (!B.length) return [{ type: "del", x: 0, y: 0, i: A.length, a: A, b: B }];
  const res = backtrace(levenshteinMinimalShifts(A, B), A, B);
  const empty = A instanceof Array || B instanceof Array ? Object.freeze([]) : "";
  for (let d of res) {
    d.a = d.type === "ins" ? empty : A.slice(d.y, d.y + d.i);
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
  const Aw = A.split(/\b/), Bw = B.split(/\b/);
  if ((Aw.length * Bw.length) < 1_000_000)
    return secondStep(diffRaw(Aw, Bw));
  throw new Error("omg");
  //todo untested..
  return secondStep(diffRaw(A.split(/(\r?\n)/), B.split(/(\r?\n)/)));
}`;

export default [
  tstString,
  tstString.replaceAll(/i/g, "I"),
  [[48, 0], [0, 48], [74, 74], [35, 0], [0, 35], [1, 1], [36, 0], [0, 36], [1, 1], [102, 0], [0, 102], [2, 2], [44, 0], [0, 44], [38, 38], [19, 0], [0, 19], [1, 1], [19, 0], [0, 19], [24, 24], [65, 0], [0, 65], [1, 1], [20, 0], [0, 20], [1, 1], [20, 0], [0, 20], [1, 1], [19, 0], [0, 19], [106, 106], [31, 0], [0, 31], [101, 101], [69, 0], [0, 69], [1, 1], [40, 0], [0, 40], [1, 1], [36, 0], [0, 36], [2, 2], [64, 0], [0, 64], [1, 1], [60, 0], [0, 60], [1, 1], [54, 0], [0, 54], [2, 2], [32, 0], [0, 32], [1, 1], [34, 0], [0, 34], [27, 27], [90, 0], [0, 90], [1, 1], [30, 0], [0, 30], [1, 1], [32, 0], [0, 32], [32, 32], [84, 0], [0, 84], [1, 1], [28, 0], [0, 28], [1, 1], [30, 0], [0, 30], [33, 33], [29, 0], [0, 29], [1, 1], [31, 0], [0, 31], [1, 1], [29, 0], [0, 29], [12, 12], [33, 0], [0, 33], [1, 1], [38, 0], [0, 38], [1, 1], [32, 0], [0, 32], [18, 18], [40, 0], [0, 40], [55, 55], [32, 0], [0, 32], [1, 1], [17, 0], [0, 17], [119, 119], [14, 0], [0, 14], [1, 1], [19, 0], [0, 19], [1, 1], [19, 0], [0, 19], [60, 60], [37, 0], [0, 37], [1, 1], [26, 0], [0, 26], [25, 25], [38, 0], [0, 38], [1, 1], [21, 0], [0, 21], [1, 1], [38, 0], [0, 38], [37, 37], [64, 0], [0, 64], [2, 2], [25, 0], [0, 25], [1, 1], [49, 0], [0, 49], [1, 1], [50, 0], [0, 50], [1, 1], [28, 0], [0, 28], [1, 1], [32, 0], [0, 32], [1, 1], [55, 0], [0, 55], [1, 1], [28, 0], [0, 28], [1, 1], [32, 0], [0, 32], [1, 1], [55, 0], [0, 55], [2, 2], [30, 0], [0, 30], [1, 1], [30, 0], [0, 30], [22, 22], [23, 0], [0, 23], [1, 1], [31, 0], [0, 31], [1, 1], [36, 0], [0, 36], [1, 1], [100, 0], [0, 100], [1, 1], [67, 0], [0, 67], [1, 1], [100, 0], [0, 100], [1, 1], [67, 0], [0, 67], [4, 4], [31, 0], [0, 31], [1, 1], [40, 0], [0, 40], [1, 1], [79, 0], [0, 79], [1, 1], [79, 0], [0, 79], [1, 1], [62, 0], [0, 62], [1, 1], [82, 0], [0, 82], [24, 24], [61, 0], [0, 61], [1, 1], [61, 0], [0, 61], [5, 5], [29, 0], [0, 29], [4, 4], [28, 0], [0, 28], [1, 1], [89, 0], [0, 89], [2, 2], [20, 0], [0, 20], [1, 1], [35, 0], [0, 35], [1, 1], [43, 0], [0, 43], [1, 1], [24, 0], [0, 24], [1, 1], [46, 0], [0, 46], [80, 80], [28, 0], [0, 28], [5, 5], [16, 0], [0, 16], [4, 4], [28, 0], [0, 28], [1, 1], [84, 0], [0, 84], [1, 1], [25, 0], [0, 25], [1, 1], [45, 0], [0, 45], [1, 1], [42, 0], [0, 42], [1, 1], [39, 0], [0, 39], [47, 47], [40, 0], [0, 40], [1, 1], [17, 0], [0, 17], [9, 9]]
];