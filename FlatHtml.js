import { diff } from "./difference.js";

const START_TAG_HEAD_A = /<[a-z][a-z0-9-]*/ig;
const AT_BODY = /\s+([a-z_][a-z0-9.:_-]*)(?:\s*=\s*(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|([^>\s]+)))?/ig;
const START_TAG_HEAD_Z = /\/?>/ig;
const HTML_END_TAG = /<\/[a-z][a-z0-9-]*\s*>/ig;
const HTML_COMMENT = /<!--[\s\S]*?-->/ig;
const HTML_DOCTYPE = /<!doctype\s[^>]*>/ig;
const HTML_TEXT = /(?:[^<]|<(?![a-z\/!]))+/ig;

const token_re = new RegExp(
  "(?:" +
  "(" + START_TAG_HEAD_A.source + ")" +
  "((?:" + AT_BODY.source + ")*)?" + "\\s*" +
  "(" + START_TAG_HEAD_Z.source + ")" +
  ")" +
  "|(" + HTML_END_TAG.source + ")" +
  "|(" + HTML_COMMENT.source + ")" +
  "|(" + HTML_DOCTYPE.source + ")" +
  "|(" + HTML_TEXT.source + ")",
  "ig"
);

function parseStartTagBody(body) {
  const parts = [];
  const types = [];
  for (let m; (m = AT_BODY.exec(body)) !== null;) {
    const [, n, dQuote, sQuote, noQuote,] = m;
    const v = (dQuote ?? sQuote ?? noQuote)?.replace(/\\.|"/g, m => m[1] == "'" ? "'" : m[1] ? m : '\\"');
    parts.push(" "), types.push(' ');
    let first = true;
    for (let seg of n.split(':')) {
      if (!seg) continue;
      if (!first) parts.push(":"), types.push(":");
      const i = seg.search(/[-_.]/);
      const type = !first ? "r" : ((first = false), "p");
      if (i === -1)
        parts.push(seg), types.push(type);
      else
        parts.push(seg.slice(0, i), seg.slice(i)), types.push(type, 'q');
    }
    if (v) {
      parts.push("=", '"'), types.push("=", '"');
      if (n === "class" && v?.trim()) {
        const classes = v.trim().replaceAll(/\s+/g, " ").split(/(\s)/g);
        parts.push(...classes), types.push(...classes.map(([c]) => c == '$' ? "$" : c == " " ? " " : '.'));
      } else
        parts.push(v), types.push('v');
      parts.push('"'), types.push('"');
    }
  }
  return [parts, types];
}

function parseHTML(str) {
  const words = [];
  const types = [];

  let m;
  while ((m = token_re.exec(str)) !== null) {
    const [,
      head, body, _1, _2, _3, _4, tail,
      endTag, comment, doctype, text
    ] = m;

    if (head) {
      words.push(head), types.push('a');
      if (body) {
        const [bodyParts, bodyTypes] = parseStartTagBody(body || '');
        words.push(...bodyParts), types.push(...bodyTypes);
      }
      words.push(tail), types.push(tail == ">" ? ">" : "/");
    } else if (endTag)
      words.push(endTag), types.push('b');
    else if (comment)
      words.push(comment), types.push('c');
    else if (doctype)
      words.push(doctype), types.push('d');
    else if (text)
      words.push(text), types.push('t');
  }
  return { words, types };
}

export class FlatHtml {
  static TAG_START = "a";
  static TAG_END = "b";
  static COMMENT = "c";
  static DOCTYPE = "d";
  static TEXT = "t";
  static TRIGGER = "p";
  static REACTION = "r";
  static TRIGGER_REACTION_QUALIFIER = "q";
  static CSS = ".";
  static CSSS = "$";
  static ATTR_VALUE = "v";
  static ATTR_EQUAL = "=";
  static ATTR_QUOTE = '"';
  static SPACE = " ";
  static TAG_START_END = ">";
  static TAG_START_END_SELF_CLOSING = "/";

  #words;
  #types;
  #list;
  constructor(str) {
    const { words, types } = parseHTML(str);
    this.#words = words;
    this.#types = types;
    this.#list = [];
    for (let i = 0; i < words.length; i++)
      this.#list.push({ word: words[i], type: types[i] });
  }
  get words() { return this.#words; }
  get types() { return this.#types; }
  toString() { return this.#words.join(''); }
  get list() { return this.#list; }
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
    this.#diffs = diff(A.words, B.words);
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