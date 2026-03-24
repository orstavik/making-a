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

  const PSEUDO = /(.*?)((::[a-z-]+|(:before|:after|:first-letter|:first-line))(:[a-z-]+)*)$/i;
  function extractPseudo(selector) {
    const m = selector.match(PSEUDO);
    return m ?
      { selector: m[1], pseudo: m[4] ? ":" + m[1] : m[1] } :
      { selector, pseudo: "" };
  }

  function separateImportantNormalPropertis(r) {
    let native = r.rule.style, important, normal;
    for (let i = 0; i < native.length; i++) {
      const p = native[i];
      const camel = p.replace(/-([a-z])/g, g => g[1].toUpperCase());
      const target = native.getPropertyPriority(p) ? (important ??= {}) : (normal ??= {});
      target[camel] = native.getPropertyValue(p);
    }
    return { important, normal };
  }

  function prepRules(allRules, layers) {
    const normal = {};
    const important = {};
    allRules = allRules.flatMap(splitTopComma);
    for (let r of allRules) {
      const { selector, pseudo } = extractPseudo(r.selector);
      r.selector = selector;
      (normal[pseudo] ??= []).push(r);
    }
    for (let k in normal) {
      const rules = normal[k]
        //todo we filter on supports and media here. This is something that might cause issues in use later.
        .map(r => ({ ...r, ...separateImportantNormalPropertis(r) }))
        .filter(r => (!r.media || matchMedia(r.media).matches) && (!r.supports || CSS.supports(r.supports)))
        .map(r => ({
          ...r,
          priority: ((layers.indexOf(r.layer) + 1) * 100_000_000) + specificity(r.selector),
          priorityImportant: ((layers.indexOf(r.layer) + 1) * -100_000_000) + specificity(r.selector),
        }));
      important[k] = [...rules].sort((a, b) => a.priorityImportant - b.priorityImportant);
      normal[k] = rules.sort((a, b) => a.priority - b.priority);
    }
    return { normal, important };
  }

  function assignStyle(acc, style, layer = "<unlayered>") {
    for (let p of style) {
      //todo we need to do this once in the prep step.
      const camel = p.replace(/-([a-z])/g, g => g[1].toUpperCase());
      const value = style.getPropertyValue(p);
      const old = acc[camel];
      //todo under two different tables. one for important and one for normal props.
      if (!old?.layer || (layer == old.layer && style.getPropertyPriority(p)))
        acc[camel] = { value, layer: style.getPropertyPriority(p) && layer };
    }
    return acc;
  }

  const { flatRules, layers, others } = await getAllRules([...sheets]);
  const { normal } = prepRules(flatRules, [...layers, undefined]);

  function getComputedStyleRaw(el, pseudo = "") {
    if (!(el instanceof Element))
      throw new TypeError("First argument must be an Element");
    if (pseudo && !pseudo.startsWith("::"))
      pseudo = ":" + pseudo;
    const rules = normal[pseudo] || [];
    const res = {};
    !pseudo && assignStyle(res, el.style, undefined);
    for (let r of rules)
      if (el.matches(r.selector))
        assignStyle(res, r.rule.style, r.layer);
    !pseudo && assignStyle(res, el.style, undefined);
    for (let k in res)
      res[k] = res[k].value;
    return res;
  }
  return { getComputedStyleRaw, rules: normal, others };
}
//todo 2. fix the pseudoElement in getComputedStyle. Make sure that :before is normalized in the query and the table.