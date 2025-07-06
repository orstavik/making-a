const EDIT = 1 << 16;
const STREAKEND = 1;

const GRID_STYLE = `
<style>
  div.mono {
    display: grid;
    grid-auto-rows: 1fr;
    grid-auto-columns: auto;
    grid-auto-flow: row;
    font-family: monospace;
    text-align: center;
  }

  div.mono > div {
    border: 1px solid skyblue;
    padding: 0.2em;
    margin: 0;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  div.mono > div:hover::before {
    content: attr(a) "|" attr(b);
    position: absolute;
    top: 0;
    left: 0;
    background-color: white;
    z-index: 1000;
  }
  div.mono > div.del { background-color: salmon; }
  div.mono > div.add { background-color: plum; }
  div.mono > div.cross { background-color: chocolate; }
  div.mono > div.match { background-color: lime; }
  div.mono > div.end { background-color: grey; }
/*
  div.mono > div > * {
    position: absolute;
    top: 0;
    left: 100%;
    display: none;
  }
  div.mono > div:hover > * {
    display: block;
    background-color: white;
    z-index: 1000;
  }
*/
</style>`;
document.head.insertAdjacentHTML("beforeend", GRID_STYLE);

function* backtrace(table, W) {
  for (let n = table.length - 1; n >= 0;) {
    const y = Math.floor(n / W);
    const x = n % W;
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
        type = "cross";
      } else {
        const up = table[n - W];
        const left = table[n - 1];
        upLeft -= EDIT;
        if (up <= left && up <= upLeft)
          type = "del";
        else if (left <= up && left <= upLeft)
          type = "add";
        else
          type = "cross";
      }
    }
    yield { type, now, n, x, y };
    if (type != "del") n -= 1;
    if (type != "add") n -= W;
  }
}

function* backtraceMatches(table, A, B) {
  for (let p of backtrace(table, B.length + 1)) {
    p.a = A[p.y - 1];
    p.b = B[p.x - 1];
    if (p.type == "cross" && p.a == p.b) p.type = "match";
    yield p;
  }
}

function printGrid(rows, bt, A, B) {

  const grid = `<div class="mono" style="grid-template-columns: repeat(${B.length + 2}, max-content);">
      ${Array.from(rows).map(n => `<div a="" b="">${n >> 16}.${n & 0xFFFF}</div>`).join("")}
    </div>`;
  document.body.insertAdjacentHTML("beforeend", grid);
  const children = document.body.lastElementChild.children;

  for (let p of bt) {
    children[p.n].classList.add(p.type);
    p.a && children[p.n].setAttribute("a", p.a);
    p.b && children[p.n].setAttribute("b", p.b);
  }
  children[0].insertAdjacentHTML("beforebegin", (" " + B).split("").map(c => `<div>${c}</div>`).join(""));
  A = "  " + A;
  for (let i = 0; i < A.length; i++)
    children[i * (B.length + 2)].insertAdjacentHTML("beforebegin", `<div>${A[i]}</div>`);
}

function test(A, B) {
  const table = levenshteinLengthWeight(A, B);
  const bt = [...backtraceMatches(table, A, B)];
  printGrid(table, bt, A, B);
}

test("aby", "abx");
test("ab", "ab_a_bxx");
test("ab", "a_b_abxx");
test("ab_a_bx", "ab");
test("a_b_abx", "ab");
test("xxa_b_abx", "ab");

export function levenshteinLengthWeight(A, B) {
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

export function diffAsArray(A, B) {
  const table = levenshteinLengthWeight(A, B);
  const res = [];
  let now, i = table.length - 1, j = table[0].length - 1;
  while (i > 0 && j > 0 && (now = table[i][j])) {
    const equals = now & 0xFF;
    if (equals) {
      i -= equals;
      j -= equals;
      const a = A.slice(i, i + equals);
      res.unshift({ a });
    } else {
      const topLeft = table[i - 1][j - 1], top = table[i - 1][j], left = table[i][j - 1];
      if (!res[0]?.b) res.unshift({ a: [], b: [] });
      if ((topLeft >= top && topLeft >= left) || top >= left)
        res[0].a.unshift(A[--i]);
      if ((topLeft >= top && topLeft >= left) || left > top)
        res[0].b.unshift(B[--j]);
    }
  }
  if (i || j)
    res.unshift({ a: A.slice(0, i), b: B.slice(0, j) });
  return res;
}

export function diffAsStr(A, B) {
  const table = levenshteinLengthWeight(A, B);
  const res = [];
  let now, i = table.length - 1, j = table[0].length - 1;
  while (i >= 0 && j >= 0 && (now = table[i][j])) {
    const equals = now & 0xFF;
    if (equals) {
      i -= equals;
      j -= equals;
      const str = A.slice(i, i + equals).join("");
      res.unshift({ a: str, b: str });
    } else {
      const topLeft = table[i - 1][j - 1], top = table[i - 1][j], left = table[i][j - 1];
      const a = (topLeft >= top && topLeft >= left) || top >= left ? A[--i] : "";
      const b = (topLeft >= top && topLeft >= left) || left > top ? B[--j] : "";
      res[0]?.a == res[0]?.b ? res.unshift({ a, b }) :
        (res[0].a = a + res[0].a, res[0].b = b + res[0].b);
    }
  }
  if (i || j)
    res.unshift({ a: A.slice(0, i).join(""), b: B.slice(0, j).join("") });
  return res;
}

export function diff(A, B) {
  const table = levenshteinLengthWeight(A, B);
  const height = A.length;
  const width = B.length;

  const res = [];
  let now, i = height - 1, j = width.length - 1;
  while (i > 0 && j > 0 && (now = table[i][j])) {
    const equals = A[i] === B[j];
    if (equals) {
      i -= 1;
      j -= 1;
      const str = A.slice(i, i + 1);
      res.unshift({ a: str, b: str });
    } else {
      const topLeft = table[i - 1][j - 1], top = table[i - 1][j], left = table[i][j - 1];
      const a = (topLeft >= top && topLeft >= left) || top >= left ? A[--i] : "";
      const b = (topLeft >= top && topLeft >= left) || left > top ? B[--j] : "";
      res[0]?.a == res[0]?.b ? res.unshift({ a, b }) :
        (res[0].a = a + res[0].a, res[0].b = b + res[0].b);
    }
  }
  if (i || j)
    res.unshift({ a: A.slice(0, i), b: B.slice(0, j) });
  return res;
}
