import { diff } from "./difference.js";

const START_TAG_HEAD_A = /<([a-z][a-z0-9-]*)/ig;
const AT_BODY = /\s+([a-z_][a-z0-9.:_-]*)(?:\s*=\s*(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|([^>\s]+)))?/ig;
const START_TAG_HEAD_Z = /\s*\/?>/ig;
const HTML_END_TAG = /<\/([a-z][a-z0-9-]*)\s*>/ig;
const HTML_COMMENT = /<!--([\s\S]*)?-->/ig;
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
  const words = [];
  const types = [];

  let m;
  while ((m = token_re.exec(str)) !== null) {
    const [,
      head, body, _1, _2, _3, _4,
      endTag, comment, doctype, text
    ] = m;

    if (head) {
      words.push(head), types.push('A');
      if (body) {
        for (let m; (m = AT_BODY.exec(body)) !== null;) {
          const [, n, dQuote, sQuote, noQuote,] = m;
          n.split(':').forEach((tr, i) => { words.push(tr); types.push(i ? 'r' : 't') });
          const v = (dQuote ?? sQuote ?? noQuote)?.replace(/\\.|"/g, m => m[1] == "'" ? "'" : m[1] ? m : '\\"');
          if (!v) continue;
          if (n == "class" && v?.trim())
            v.trim().split(/\s+/g).forEach(c => { words.push(c); types.push("c") });
          else if (v)
            words.push(v), types.push('v');
        }
      }
    } else if (endTag)
      words.push(endTag), types.push('B');
    else if (comment)
      words.push(comment), types.push('C');
    else if (doctype)
      words.push(doctype), types.push('D');
    else if (text)
      words.push(text), types.push('T');
  }
  return { words, types };
}

function toString(words, types) {
  function wrap(w, t) {
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

  let txt = wrap(words[0], types[0]);
  for (let i = 1; i < words.length; i++) {
    const prevType = types[i - 1];
    const type = types[i];
    const between = BETWEENS[prevType + type] ?? POSTS[prevType] ?? "";
    txt += between + wrap(words[i], prevType = type);
  }
  return txt + POSTS[types[types.length - 1]] ?? "";
}


export class FlatHtml {
  static TAG_START = "A";
  static TAG_END = "B";
  static COMMENT = "C";
  static DOCTYPE = "D";
  static TEXT = "T";
  static TRIGGER = "t";
  static REACTION = "r";
  static CLASS = "c";
  static ATTR_VALUE = "v";

  #words;
  #types;

  constructor(words, types) {
    if (typeof words === 'string')
      ({ words, types } = parseHTML(words));
    this.#words = words.slice();
    this.#types = types.slice();
  }

  update(...indexWordTypes) {
    const words = this.#words.slice();
    const types = this.#types.slice();
    for (let { index, word, type } of indexWordTypes) {
      words[index] = word;
      types[index] = type;
    }
    return new FlatHtml(words, types);
  }

  insert(...indexWordTypes) {
    const words = this.#words.slice();
    const types = this.#types.slice();
    for (let { index, word, type } of indexWordTypes) {
      words.splice(index, 0, word);
      types.splice(index, 0, type);
    }
    return new FlatHtml(words, types);
  }

  delete(...indexWordTypes) {
    const words = this.#words.slice();
    const types = this.#types.slice();
    for (let { index } of indexWordTypes) {
      words.splice(index, 1);
      types.splice(index, 1);
    }
    return new FlatHtml(words, types);
  }

  get words() { return this.#words; }
  get types() { return this.#types; }
  get list() { return this.#words.map((word, index) => ({ index, word, type: this.#types[index] })); }
  toString() { return toString(this.#words, this.#types); }
}

export class FlatHtmlDiff {

  #a;
  #b;
  #diffs;
  #list;

  constructor(A, B) {
    if (typeof A === 'string') A = new FlatHtml(A);
    if (typeof B === 'string') B = new FlatHtml(B);
    if (!(A instanceof FlatHtml) || !(B instanceof FlatHtml))
      throw new TypeError("Both arguments must be string or FlatHtml.");
    this.#a = A;
    this.#b = B;
    //remove the syntactic characters
    this.#diffs = diff(A.words, B.words);
    //add the syntactic characters again?
    const empty = Object.freeze([]);
    for (let d of this.#diffs) {
      d.at = d.type === "add" ? empty : A.types.slice(d.y, d.y + d.i);
      d.bt = d.type === "del" ? empty : B.types.slice(d.x, d.x + d.i);
    }
    this.#list = this.#diffs.flatMap(
      ({ type, a: A, b: B, at: AT, bt: BT }) =>
        type == "match" ? A.map((a, i) => ({ type, a, at: AT[i], b: B[i], bt: BT[i] })) :
          type == "del" ? A.map((a, i) => ({ type, a, at: AT[i], b: null, bt: null })) :
            B.map((b, i) => ({ type, a: null, at: null, b, bt: BT[i] }))
    );
  }
  get a() { return this.#a; }
  get b() { return this.#b; }

  get diffs() { return this.#diffs; }
  get all() { return this.#list; }
  get aSide() { return this.#list.filter(({ a }) => a); } //type !== "add"
  get bSide() { return this.#list.filter(({ b }) => b); }// type !== "del"
  get changed() { return this.#list.filter(({ type }) => type !== "match"); }
  get unchanged() { return this.#list.filter(({ type }) => type === "match"); }
  get added() { return this.#list.filter(({ type }) => type === "add"); }
  get removed() { return this.#list.filter(({ type }) => type === "del"); }
}