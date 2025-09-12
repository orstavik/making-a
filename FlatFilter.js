const EXTRAS = new WeakMap();  //maps from arrayObj => {parents:[], end:[], depth:[]}

function _makeExtra(tokens) {
  const parents = [], end = [];
  let stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    parents[i] = stack.at(-1); //todo FULL_TAG
    if (t.type === TAG_START) { //only do this with open tags
      stack.push(i);
    } else if (t.type === TAG_END) {
      const startIndex = stack.pop();
      if(tokens[startIndex].text !== t.text)
        throw new Error(`Mismatched tags: <${tokens[startIndex].text}> closed by </${t.text}>`);
      end[startIndex] = i;
      end[i] = startIndex;
    }
  }
  if(stack.length)
    throw new Error(`Unclosed tags at the end: ${stack.map(i=>tokens[i].text).join(", ")}`);
  return { parents, end };
}

function extra(tokens) {
  if (EXTRAS.has(tokens))
    return EXTRAS.get(tokens);
  Object.freeze(tokens);
  const x = _makeExtra(tokens);
  EXTRAS.set(tokens, x);
  return x;
}


function _children(all, indexes, TYPE) {
  const { parents, end } = extra(all);
  const result = new Set();
  for (const i of indexes) {
    if (all[i].type != TAG_START) continue;
    const e = end[i];
    for (let j = i + 1; j < e; j++)
      if (parents[j] == i && all[j].type == TYPE)
        result.push(j), j = end[j];  //using end tags to skip along faster
  }
  return result;
}

function _attrClassChildren(all, indexes, TYPE) {
  const { parents, end } = extra(all);
  const result = new Set();
  for (const i of indexes) {
    if (all[i].type != TAG_START) continue;
    const e = end[i];
    for (let j = i + 1; j < e; j++) {
      if (parents[j] == i && all[j].type == TYPE)
        result.push(j);
      else if (all[j].type == TAG_START || all[j].type == TEXT || all[j].type == COMMENT)
        break;
    }
  }
  return result;
}


//indexes as arrays
function parents(all, indexes) {
  const { parents } = extra(all);
  const res = new Set();
  for (let i of indexes) {
    if (all[i].type != TAG_START) continue;
    if (parents[i] != null)
      res.add(parents[i]);
  }
  return res;
}

function ancestors(all, indexes) {
  const { parents } = extra(all);
  const res = new Set();
  for (let i of indexes) {
    if (all[i].type != TAG_START) continue;
    for (i; parents[i] != null; i = parents[i])
      res.add(parents[i]);
  }
  return res;
}

function children(all, indexes) {
  return _children(all, indexes, TAG_START);
}

//first is 1.
// #negative, then start from endtag, reverse iterate, and then stop when n-=1 until the n is the same as the input.
// #positive start from endofstart, iterate and stop when n+=1 == inputN. 
function nthChild(all, indexes, n) {
  return [...children(all, indexes)].at(n);  //this can be optimized if we need.
}

function descendants(all, indexes) {
  const { end } = extra(all);
  const result = new Set();
  for (const i of indexes) {
    if (all[i].type != TAG_START) continue;
    const e = end[i];
    for (let j = i + 1; j < e; j++)
      if (all[j].type == TAG_START)
        result.push(j);
  }
  return result;
}

//reverse order, youngest/nearestToOrigin first, firstChild is last
//however, since 
function olderSiblings(all, indexes) {
  const { parents, end } = extra(all);
  const result = new Set();
  for (const i of indexes) {
    if (all[i].type != TAG_START) continue;
    const p = parents[i];
    for (let j = i - 1; j > p; j--)
      if (parents[j] == p && all[j].type == TAG_START)
        result.push(j), j = end[j]; //skip to start of this tag
  }
  return result;
}

function youngerSiblings(all, indexes) {
  const { parents, end } = extra(all);
  const result = new Set();
  for (const i of indexes) {
    if (all[i].type != TAG_START) continue;
    const p = parents[i];
    const pEnd = end[p];
    for (let j = end[i] + 1; j < pEnd; j++)
      if (parents[j] == p && all[j].type == TAG_START)
        result.push(j), j = end[j]; //skip to start of this tag
  }
  return result;
}

//todo we need to ensure that the .union method on sets is polyfilled.
function siblings(all, indexes) {
  const older = olderSiblings(all, indexes);
  const res = new Set(Array.from(older).reverse());
  res.union(youngerSiblings(all, indexes));
  return res;
}

function owners(all, indexes) { //from attr/class to element
  const { parents } = extra(all);
  const res = new Set();
  for (const i of indexes)
    if (all[i].type == ATTR || all[i].type == CLASS)
      res.add(parents[i]);
  return res;
}

function classAttr(all, indexes) {
  const res = new Set();
  for (const i of indexes)
    for (let j = i - 1; j >= 0; j--)
      if (all[i].type == ATTR) {
        res.add(parents[i]);
        break;
      }
  return res;
}

//use filter("text"/"comment"/"attribute"/"class") to get the different nodes for the entire document
function textNodes(all, indexes) { return _children(all, indexes, TEXT); }
function comments(all, indexes) { return _children(all, indexes, COMMENT); }
function attributes(all, indexes) { return _attrClassChildren(all, indexes, ATTR); }
function classes(all, indexes) { return _attrClassChildren(all, indexes, CLASS); }

function filterByType(all, indexes, types) {
  const res = new Set();
  for (const i of indexes ?? all)
    if (types == all[i].type || types.includes(all[i].type))
      res.add(i);
  return res;
}

function equals(all, indexes, filter) {
  const res = new Set();
  for (const i of indexes ?? all)
    if (all[i].text == filter)
      res.add(i);
  return res;
}

function filter(all, indexes, regEx) {
  const res = new Set();
  for (const i of indexes ?? all)
    if (all[i].text.match(regEx))
      res.add(i);
  return res;
}

export default {
  parents,
  ancestors,
  children,
  nthChild,
  descendants,
  olderSiblings,
  youngerSiblings,
  siblings,
  owners,
  classAttr,
  textNodes,
  comments,
  attributes,
  classes,
  filterByType,
  equals,
  filter,
}