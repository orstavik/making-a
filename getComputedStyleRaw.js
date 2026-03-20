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

async function cssRulesFallback(sheetOrCtxRule, e) {
  try {
    return sheetOrCtxRule.cssRules;
  } catch {
    if (!sheetOrCtxRule.href)
      return;
    const txt = await fetch(sheetOrCtxRule.href).then(r => r.text());
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const baseEl = iframe.ownerDocument.createElement("base");
    baseEl.href = sheetOrCtxRule.href;
    iframe.ownerDocument.head.appendChild(baseEl);
    const styleEl = iframe.ownerDocument.createElement("style");
    iframe.ownerDocument.head.appendChild(styleEl);
    styleEl.textContent = txt;
    document.body.removeChild(iframe);
    return styleEl.sheet.cssRules;
  };
}

export async function GetComputedStyleRaw(SHEETS = document.styleSheets, getCssRules = cssRulesFallback) {

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
          others.push(rule);
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

  const PSEUDO = /(.*?)(::[a-z-]+)((:[a-z-]+)*)$/i;
  function prepRules(allRules, layers) {
    for (let r of allRules) {
      const pseudo = r.rule.selectorText.match(PSEUDO);
      r.pseudo = pseudo?.[2];
      r.selector = pseudo ? pseudo[1] + (pseudo[3] || "") : r.rule.selectorText;
      r.priority = ((layers.indexOf(r.layer) + 1) * 100_000_000) + specificity(r.selector);
    }
    return allRules.sort((a, b) => a.priority - b.priority);
  }

  function assignStyle(acc, style, layer = "<unlayered>") {
    for (let p of style) {
      const camel = p.replace(/-([a-z])/g, g => g[1].toUpperCase());
      const value = style.getPropertyValue(p);
      const old = acc[camel];
      if (!old?.layer || (layer == old.layer && style.getPropertyPriority(p)))
        acc[camel] = { value, layer: style.getPropertyPriority(p) && layer };
    }
    return acc;
  }

  const { flatRules, layers, others } = await getAllRules([...SHEETS]);
  const rulesSorted = prepRules(flatRules, [...layers, undefined]);
  const allRules = rulesSorted.filter(r =>
    (!r.media || matchMedia(r.media).matches) && (!r.supports || CSS.supports(r.supports)))
  const RULES = {};
  for (let r of allRules)
    (RULES[r.pseudo || ""] ??= []).push(r);

  return function getComputedStyleRaw(el, pseudo = "") {
    if (el == null)
      return others;
    const res = assignStyle({}, el.style, undefined);
    for (let r of RULES[pseudo] ?? [])
      if (el.matches(r.selector))
        assignStyle(res, r.rule.style, r.layer);
    assignStyle(res, el.style, undefined);
    for (let k in res)
      res[k] = res[k].value;
    return res;
  }
}