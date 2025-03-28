import { diff } from "./difference.js";

class Template {
  constructor(a, b) {
    this.main = a;
    this.map = new Map();
    const bSnake = diff(a, b);
    this.map.set(b, bSnake);
    this.template = bSnake.map(({ a, b }) => a === b ? a.join("") : "");
  }

  tryToAddTxt(b) {
    const bDiff = diff(this.main, b);
    if (bDiff.length !== this.template.length)
      return false;
    const bTemplate = bDiff.map(({ a, b }) => a === b ? a.join("") : "");
    if (!bTemplate.every((c, i) => c === this.template[i]))
      return false;
    this.map.set(b, bDiff);
  }
}

export default {
  Template,
  diff,
}