const ENDPOINT = Symbol("endpoint");

function matchPath(tree, segs, i) {
  if (i === segs.length - 1)
    return tree[ENDPOINT] || tree["*"]?.[ENDPOINT];
  let res = tree[segs[i]] ?? tree[":param"];
  if (res &&= matchPath(res, segs, i + 1))
    return res;
  return tree["*"]?.[ENDPOINT];
}

function makeParams(names, segs) {
  const params = {};
  for (let i = 0; i < names.length; i++)
    if (names[i])
      params[i] = params[names[i]] = segs[i];
  return params;
}

export class Router {
  #flat = {};
  #tree = {};
  #flatTree = {};

  constructor(endPoints) {
    for (let [pathRaw, func] of Object.entries(endPoints)) {
      if (pathRaw.match(/^\/|\/$|\/\:\/|\*(?!$)/gi))
        throw new Error(`Path cannot start or end with "/", or contain "/:/" or "*": ${pathRaw}`);
      const segsRaw = pathRaw.split("/");
      const segs = segsRaw.map(s => s[0] === ":" ? ":param" : s);
      const path = segs.join("/");
      if (pathRaw === path && !path.endsWith("*")) {
        this.#flat[path] = { func, names: [], params: {} };
        continue;
      }
      const names = segsRaw.map(s => s[0] === ":" ? s.slice(1) : null);
      while (names.length && names.at(-1) == null) names.pop();
      const treeNode = segs.reduce((tree, seg) => tree[seg] ??= {}, this.#tree);
      if (ENDPOINT in treeNode)
        throw new Error(`Router duality: ${pathRaw} vs ${treeNode[ENDPOINT].pathRaw}`);
      this.#flatTree[path] = treeNode[ENDPOINT] = { func, names, path, pathRaw };
    }
  }

  /**
   * @param {string} path cannot start with '/', end with '*', or contain ':'.
   * @returns {func: value, params: {Object}}
   */
  match(path) {
    if (path in this.#flat)
      return this.#flat[path];
    if (path.startsWith("/")) throw new Error(`Path cannot start with "/": ${path}`);
    if (path.endsWith("*")) throw new Error(`Path cannot end with "*": ${path}`);
    if (path.includes(":")) throw new Error(`Path cannot contain ":": ${path}`);
    const segs = path.split("/");
    const ep = matchPath(this.#tree, segs, 0);
    if (ep) ep.params = makeParams(ep.names, segs);
    return ep;
  }

  /**
   * prints a simple list of all endPoints in alphabetical and priority order.
   */
  toString() {
    const sortable = (s) => s.replace(":", '\uFFFE').replace("*", '\uFFFF');
    return Object.entries({ ...this.#flat, ...this.#flatTree })
      .sort(([a], [b]) => (a = sortable(a)) < (b = sortable(b)) ? -1 : a > b ? 1 : 0)
      .map(([path, { func, names }]) => path + ": " + func.name + "[" + (names || "") + "]")
      .join("\n");
  }

  static reduceFunc(funcs) {
    if (!Array.isArray(funcs) || !funcs.every(f => f instanceof Function))
      throw new Error("reduceFunc expected an array of functions.");
    const name = funcs.map(n => n.name[0].toUpperCase() + n.name.slice(1)).join("_");
    const func = funcs.reduceRight((inner, wrapper) => wrapper(inner));
    Object.defineProperty(func, "name", { value: name });
    return func;
  }
}