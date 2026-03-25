function resolveCssVariables(str, getCssVariableFn) {
  const CssVar = /var\(\s*(--[\w-]+)\s*/;

  for (let m, i = 100; m = str.match(CssVar);) {
    if (!--i) return "unset"; //circular reference or 100 nested vars() => unset.
    let [full, varName] = m;
    for (let j = m.index + full.length, depth = 0; j < str.length; j++) {
      let fallback;
      if (str[j] === "(")
        depth++;
      else if (str[j] === ")" && depth)
        depth--;
      else if (str[j] === ")") {
        fallback = str.slice(m.index + full.length + 1, j).trim();
        full = str.slice(m.index, j + 1);
        break;
      }
    }
    const value = getCssVariableFn(varName) ?? fallback;
    if (value == null)
      return "unset";
    str = str.replaceAll(full, value);
  }
  return str;
}

function specificity(selector) {
  const QuoteRX = /(["'])(?:(?=(\\?))\2.)*?\1/gi;
  const ClassRX = /(\.[^\s()#.[\]>+~*,:"']+|\[[^\]]*\]|:(?!(is|not|has|where))[\w-]+(\([^)(]*\))?)/gi;
  const IdRX = /#[^\s()#.[\]>+~*,:"']+/gi;
  const TagRX = /(?<![:\w-])[\w-]+/gi;
  const PseudoRX2 = /:(is|not|has|where)\(([^)(]*)\)/;

  let s = selector.replaceAll(QuoteRX, '');
  s = s.replaceAll(IdRX, "#");
  s = s.replaceAll(ClassRX, ".");
  s = s.replaceAll(TagRX, "x");

  s = s.replaceAll(/[#.x]+/g, c =>
    c.split("").reduce((acc, n) => acc + (n == "#" ? 1000_000 : n == "." ? 1000 : 1), 0));

  const calcExpr = s => s.match(/\d+/g)?.reduce((a, b) => a + +b, 0) ?? "";
  for (let m; m = s.match(PseudoRX2);)
    s = s.replaceAll(m[0], m[1] === "where" ? "" :
      "|" + Math.max(...m[2].split(",").map(calcExpr)) + "|");
  return calcExpr(s);
}

const cssRuleFallback = (urlRewriter) =>
  async function cssRulesFallback(sheetOrCtxRule, e) {
    try {
      return sheetOrCtxRule.cssRules;
    } catch {
      const base = sheetOrCtxRule.href;
      if (!base) return;
      let txt = await fetch(urlRewriter(base)).then(r => r.text());
      txt = txt.replace(
        /(@import\s+(?:url\(\s*)?|url\(\s*)['"]?([^'"\)]+)['"]?(\s*\)?)/g,
        (m, pre, url, post) => `${pre}"${new URL(url, base).href}"${post}`
      );
      const sheet = new CSSStyleSheet({ baseURL: sheetOrCtxRule.href });
      try { sheet.replaceSync(txt); }
      catch { await sheet.replace(txt); }
      Object.defineProperty(sheet, "href", { value: sheetOrCtxRule.href });
      return sheet.cssRules;
    };
  };

export async function GetComputedStyleRaw(options = {}) {
  let {
    sheets = document.styleSheets,
    urlRewriter = undefined,
    wait = 3000,
    getCssVariableFn,
  } = options;

  const getCssRules = urlRewriter ? cssRuleFallback(urlRewriter) : s => s.cssRules;

  wait && await Promise.all([...document.head.querySelectorAll('link[rel="stylesheet"]')]
    .filter(l => !l.sheet)
    .map(l => new Promise(r => { l.onload = r; l.onerror = r; setTimeout(r, wait); })));

  async function getAllRules(sheets) {

    function makeInnerCtx(ctx, rule) {
      let supports = rule instanceof CSSSupportsRule ? rule.conditionText : rule.supportsText;
      let media = rule.media?.mediaText || undefined;
      let layer = rule instanceof CSSLayerBlockRule ? rule.name : rule.layerName;
      if (layer === "") layer = `anon-${Math.random().toString(36).slice(2, 9)}`;
      if (layer == null && media == null && supports == null)
        return ctx;
      ctx = { ...ctx };
      if (layer != null) ctx.layer = ctx.layer ? `${ctx.layer}.${layer}` : layer;
      if (media != null) ctx.media = ctx.media ? `${ctx.media} and (${media})` : `(${media})`;
      if (supports != null) ctx.supports = ctx.supports ? `${ctx.supports} and (${supports})` : `(${supports})`;
      return ctx;
    }

    async function flattenRules(ctx, flatRules, layers, others, sheet) {
      let rules = getCssRules(sheet);
      if (rules instanceof Promise)
        rules = await rules;
      for (const rule of rules || []) {
        if (rule instanceof CSSLayerStatementRule)
          for (let name of rule.nameList)
            layers.add(ctx.layer ? `${ctx.layer}.${name}` : name);
        else if (rule.selectorText && rule.style)
          flatRules.push({ ...ctx, rule });
        else if (rule instanceof CSSFontFaceRule || rule instanceof CSSKeyframesRule)
          others.push({ ...ctx, rule });
        else {
          const nextCtx = makeInnerCtx(ctx, rule);
          if (nextCtx.layer != ctx.layer)
            layers.add(nextCtx.layer);
          await flattenRules(nextCtx, flatRules, layers, others, rule);
        }
      }
    }

    const flatRules = [], layers = new Set(), others = [];
    for (let sheet of sheets)
      await flattenRules({}, flatRules, layers, others, sheet);
    return { flatRules, layers, others };
  }

  function splitTopComma(rule) {
    function splitSelector(selector) {
      const res = [];
      let prev = 0;
      for (let i = 0, q = "", depth = 0; i < selector.length; i++) {
        const c = selector[i];
        if (q && c === q) q = "";
        else if (q) continue;
        else if (c === '"' || c === "'") q = c;
        else if (c === "(") depth++;
        else if (c === ")") depth--;
        else if (c === "," && depth === 0) {
          (res ??= []).push(selector.slice(prev, i).trim());
          prev = i + 1;
        }
      }
      res.push(selector.slice(prev).trim());
      return res;
    }
    return splitSelector(rule.rule.selectorText).map(selector => ({ ...rule, selector }));
  }

  const PSEUDO = /(.*?)((::[a-z-]+)(:[a-z-]+)*)$/i;
  function extractPseudo(selector) {
    const m = selector.match(PSEUDO);
    return m ?
      { selector: m[1] || "*", pseudo: m[4] ? ":" + m[2] : m[2] } :
      { selector, pseudo: "" };
  }

  function splitImportantAndNormalProps(native) {
    let important, normal;
    for (let i = 0; i < native.length; i++) {
      const p = native[i];
      const value = native.getPropertyValue(p);
      const camel = p.replace(/-([a-z])/g, g => g[1].toUpperCase());
      native.getPropertyPriority(p) ?
        (important ??= {})[camel] = value :
        (normal ??= {})[camel] = value;
    }
    return { important, normal };
  }

  function prepRules(flatRules, layers) {
    const normalRules = {};
    const importantRules = {};
    const allRules = {};
    flatRules = flatRules.flatMap(splitTopComma);
    for (let r of flatRules) {
      const { selector, pseudo } = extractPseudo(r.selector);
      r.selector = selector;
      (allRules[pseudo] ??= []).push(r);
    }
    for (let k in allRules) {
      allRules[k] = allRules[k]
        //todo we filter on supports and media here. This is something that might cause issues in use later.
        .filter(r => (!r.media || matchMedia(r.media).matches) && (!r.supports || CSS.supports(r.supports)))
        .map(r => ({
          ...r,
          ...splitImportantAndNormalProps(r.rule.style),
          priority: ((layers.indexOf(r.layer) + 1) * 100_000_000) + specificity(r.selector),
          priorityImportant: ((layers.indexOf(r.layer) + 1) * -100_000_000) + specificity(r.selector),
        }));
      importantRules[k] = allRules[k].slice().filter(r => r.important).sort((a, b) => a.priorityImportant - b.priorityImportant);
      normalRules[k] = allRules[k].slice().filter(r => r.normal).sort((a, b) => a.priority - b.priority);
    }
    return { normalRules, importantRules, allRules };
  }

  const { flatRules, layers, others } = await getAllRules([...sheets]);
  const { normalRules, importantRules, allRules } = prepRules(flatRules, [...layers, undefined]);

  const tmpEl = document.createElement("div");
  function ObjectAssignReverseNoOverwrite(getCssVariableFn, ...matchedRules) {
    const res = Object.create(null);
    for (let i = matchedRules.length - 1; i >= 0; i--) {
      const keys = Object.keys(matchedRules[i]);
      for (let j = keys.length - 1; j >= 0; j--) {
        const k = keys[j];
        if (k in res) continue;
        const value = matchedRules[i][k];
        const resolvedValue = value.includes("var(") ? resolveCssVariables(value, getCssVariableFn) : value;
        if (value === resolvedValue) {
          res[k] = value;
          continue;
        }
        tmpEl.style[k] = resolvedValue;
        for (let p of tmpEl.style) {
          let camel = p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          if (!(camel in res))
            res[camel] = tmpEl.style.getPropertyValue(p);
        }
      }
    }
    return Object.fromEntries(Object.entries(res).reverse());
  }

  function getComputedStyleRaw(el, pseudo = "") {
    if (!(el instanceof Element))
      throw new TypeError("First argument must be an Element");
    if (pseudo && !pseudo.startsWith("::"))
      pseudo = ":" + pseudo;
    const rules = normalRules[pseudo]?.filter(r => el.matches(r.selector)).map(r => r.normal) ?? [];
    const rulesImportant = importantRules[pseudo]?.filter(r => el.matches(r.selector)).map(r => r.important) ?? [];
    const { normal = {}, important = {} } = !pseudo ? splitImportantAndNormalProps(el.style) : {};
    const getCssVar = getCssVariableFn ?? (p => getComputedStyle(el).getPropertyValue(p));
    return ObjectAssignReverseNoOverwrite(getCssVar, ...rules, normal, ...rulesImportant, important);
    // return Object.assign(Object.create(null), ...rules, normal, ...rulesImportant, important);  //unfortunately gets into trouble with  we want to do the thing above, but we get the wrong key sequence.
  }
  return { getComputedStyleRaw, others, allRules, normalRules, importantRules, layers };
}
