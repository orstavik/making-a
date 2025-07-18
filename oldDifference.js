export function levenshteinLengthWeight(A, B) {
  const height = A.length;
  const width = B.length;
  const table = Array.from({ length: height + 1 }, _ => Array(width + 1).fill(0));
  const bonus = Array.from({ length: height + 1 }, _ => Array(width + 1).fill(0));
  const run = Array.from({ length: height + 1 }, _ => Array(width + 1).fill(0));
  for (let i1 = 0, i2 = 1; i1 < height; i1++, i2++)
    for (let j1 = 0, j2 = 1; j1 < width; j1++, j2++)
      table[i2][j2] = A[i1] === B[j1] ?
        //n = previousrun, add 1 to table, bonus += Math.ceil((n * (n + 1)) / 4), run += n + 1
        //:
        //table/bonuse = max of up or left, and set run to 0
        Math.max(table[i2][j1], table[i1][j2], table[i1][j1] + (1 << 22) + (Math.pow(table[i1][j1] & 0xFF, 2) << 8) + 1) :
        Math.max(table[i2][j1], table[i1][j2]) & ~0xFF;
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
  while (i > 0 && j > 0 && (now = table[i][j])) {
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
  const res = [];
  let now, i = table.length - 1, j = table[0].length - 1;
  while (i > 0 && j > 0 && (now = table[i][j])) {
    const equals = now & 0xFF;
    if (equals) {
      i -= equals;
      j -= equals;
      const str = A.slice(i, i + equals);
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
