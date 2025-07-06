function convertTable(table, W, H) {
  const result = Array(H - 1);
  for (let i = 0; i < H; i++)
    for (let j = 0; j < W; j++)
      (result[i] ??= [])[j] = table[i * W + j];
  return result;
}

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
  div.mono > div.highlight {
    border-color: red;
  }
  div.mono > div.matches {
    background-color: lightgreen;
  }
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
</style>`;
document.head.insertAdjacentHTML("beforeend", GRID_STYLE);

function upLefts(table, h, w) {
  const now = table[h][w];
  const up = h > 1 ? table[h - 1][w] : null;
  const left = w > 1 ? table[h][w - 1] : null;
  const upLeft = h > 1 && w > 1 ? table[h - 1][w - 1] : null;
  return { now, up, left, upLeft };
}

function priIndel(up, left, upLeft, now) {
  if (up && !left)
    return "del";
  if (left && !up)
    return "add";
  if (!up && !left)
    return "end"
  if (upLeft.textContent == now.textContent)
    return "cross";
  up = Number(up.textContent);
  left = Number(left.textContent);
  upLeft = Number(upLeft.textContent) - 1;
  if (up <= left && up <= upLeft)
    return "del";
  if (left <= up && left <= upLeft)
    return "add";
  return "cross";
}

function printGrid(rows, A, B) {
  rows = Array.from(rows).map(n => `${n >> 16}.${n & 0xFFFF}`);
  rows = convertTable(rows, B.length + 1, A.length + 1);
  rows.unshift((" " + B).split(""));
  rows.map((r, i) => r.unshift(i < 2 ? "" : A[i - 2]));
  const width = rows[0].length;
  const height = rows.length;
  const grid = `<div class="mono" style="grid-template-columns: repeat(${width}, max-content);">
      ${rows.flat().map(td => `<div>${td}</div>`).join("")}
    </div>`;
  document.body.insertAdjacentHTML("beforeend", grid);

  //convert the children into a 2d table of arrays
  const table = Array.from({ length: height }, () => Array(width).fill(0));
  for (let i = 0; i < height; i++)
    for (let j = 0; j < width; j++)
      table[i][j] = document.body.lastElementChild.children[i * width + j];

  const actions = [];
  for (let w = width - 1, h = height - 1; w >= 1 && h >= 1;) {
    const { now, up, left, upLeft } = upLefts(table, h, w);
    const a = A[h - 2];
    const b = B[w - 2];
    now.classList.add("highlight");
    const type = priIndel(up, left, upLeft, now);
    if (a == b && type == "cross") now.classList.add("matches");
    if (type == "end") break;
    if (type == "add") {
      w -= 1;
      now.insertAdjacentHTML("beforeend", `<span>${type}: ${b}</span>`);
    } else if (type == "del") {
      h -= 1;
      now.insertAdjacentHTML("beforeend", `<span>${type}: ${a}</span>`);
    } else {
      h -= 1;
      w -= 1;
      now.insertAdjacentHTML("beforeend", `<span>${type}: ${b + a}</span>`);
    }
  }
}


function test(A, B) {
  printGrid(levenshteinLengthWeight(A, B), A, B);
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
  table[0] = 0;
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
