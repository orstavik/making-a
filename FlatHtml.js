import { diffRaw, diff } from "./difference.js";

const START_TAG_HEAD_A = /<([a-z][a-z0-9-]*)/ig;
const AT_BODY = /\s+([a-z_][a-z0-9.:_-]*)(?:\s*=\s*(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|([^>\s]+)))?/ig;
const START_TAG_HEAD_Z = /\s*\/?>/ig;
const HTML_END_TAG = /<\/([a-z][a-z0-9-]*)\s*>/ig;
const HTML_COMMENT = /<!--(.*?)-->/ig;
const HTML_DOCTYPE = /<!doctype\s([^>]*)>/ig;
const HTML_TEXT = /((?:[^<]|<(?![a-z\/!]))+)/ig;

const token_re = new RegExp(
  "(?:" +
  START_TAG_HEAD_A.source +
  "((?:" + AT_BODY.source + ")*)?" +
  START_TAG_HEAD_Z.source +
  ")" +
  "|" + HTML_END_TAG.source +
  "|" + HTML_COMMENT.source +
  "|" + HTML_DOCTYPE.source +
  "|" + HTML_TEXT.source,
  "ig"
);

function parseHTML(str) {
  const res = [];

  let m;
  while ((m = token_re.exec(str)) !== null) {
    const [,
      head, body, _1, _2, _3, _4,
      endTag, comment, doctype, text
    ] = m;

    if (head) {
      res.push('A' + head);
      if (body) {
        for (let m; (m = AT_BODY.exec(body)) !== null;) {
          const [, n, dQuote, sQuote, noQuote,] = m;
          n.split(':').forEach((tr, i) => res.push((i ? 'r' : 't') + tr));
          const v = (dQuote ?? sQuote ?? noQuote)?.replace(/\\.|"/g, m => m[1] == "'" ? "'" : m[1] ? m : '\\"');
          if (!v) continue;
          if (n == "class" && v?.trim())
            v.trim().split(/\s+/g).forEach(c => res.push("c" + c));
          else if (v)
            res.push('v' + v);
        }
      }
    } else if (endTag)
      res.push('B' + endTag);
    else if (comment)
      res.push('C' + comment);
    else if (doctype)
      res.push('D' + doctype);
    else if (text)
      res.push('T' + text);
  }
  return res;
}

function toString(atWords) {
  function wrap(atw) {
    let t = atw[1], w = atw.slice(2);
    const BEFORE = {
      "A": "<",
      "B": "</",
      "C": "<!--",
      "D": "<!doctype ",
    };
    const AFTER = {
      "B": ">",
      "C": "-->",
      "D": ">",
    };
    if (t in BEFORE) w = BEFORE[t] + w;
    if (t in AFTER) w += AFTER[t];
    return w;
  }

  const BETWEENS = {
    "At": " ",
    "tr": ":",
    "rr": ":",
    "tv": '="',
    "rv": '="',
    "tc": '="',
    "rc": '="',
    "cc": " ",
    "vt": '" ',
    "ct": '" ',
  };
  const POSTS = {
    "A": ">",
    "v": '">',
    "c": '">',
    "t": '>',
    "r": '>',
  };

  let txt = wrap(atWords[0]);
  for (let i = 1; i < atWords.length; i++) {
    const prevType = atWords[i - 1][1];
    const type = atWords[i][1];
    const between = BETWEENS[prevType + type] ?? POSTS[prevType] ?? "";
    txt += between + wrap(atWords[i]);
  }
  return txt + POSTS[atWords.at(-1)[1]] ?? "";
}

class FlatHtml {
  static TAG_START = "A";
  static TAG_END = "B";
  static COMMENT = "C";
  static DOCTYPE = "D";
  static TEXT = "T";
  static TRIGGER = "t";
  static REACTION = "r";
  static CLASS = "c";
  static ATTR_VALUE = "v";

  #atw;

  constructor(atw) { this.#atw = Object.freeze(atw); }
  atw() { return this.#atw; }
  side(p = 1) { return new FlatHtml(this.#atw.filter(([a]) => !+a || a == p)); }
  toString() { return toString(this.#atw); }
  toArray() {
    return this.#atw.map((atw, index) => ({ index, action: atw[0], type: atw[1], word: atw.slice(2) }));
  }

  reset() { return new FlatHtml(this.#atw.map(atw => "0" + atw.slice(1))); }

  diff(B) {
    if (typeof B === 'string') B = FlatHtml.fromString(B);
    if (!(B instanceof FlatHtml))
      throw new TypeError("Argument must be string or FlatHtml.");
    const raws = diffRaw(this.#atw, B.#atw);
    const diffs = raws.flatMap(({ type: action, a, b }) =>
      action == "ins" ? b.map(b => "2" + b.slice(1)) :
        action == "del" ? a.map(a => "1" + a.slice(1)) :
          a.map(a => "0" + a.slice(1))
    );
    return new FlatHtml(diffs);
  }

  static fromArray(arr) {
    return new FlatHtml(arr.map(({ action, type, word }) => "" + action + type + word));
  }
  static fromString(str) {
    return new FlatHtml(parseHTML(str).map(tWord => "0" + tWord));
  }
}
export {
  diff,
  FlatHtml,
};