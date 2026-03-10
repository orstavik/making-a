function selectorSpecificity(selector) {
  const QuoteRX = /(["'])(?:(?=(\\?))\2.)*?\1/gi;
  const ClassRX = /(\.[^\s()#.[\]>+~*,:"']+|\[[^\]]*\]|:(?!(is|not|has|where))[\w-]+(\([^)(]*\))?)/gi; //replace with "."
  const IdRX = /#[^\s()#.[\]>+~*,:"']+/gi;
  const TagRX = /(?<![:\w-])[\w-]+/gi;
  const PseudoRX2 = /:(is|not|has|where)\(([^)(]*)\)/;


  let s = selector.replaceAll(QuoteRX, '');
  s = s.replaceAll(IdRX, "#");
  s = s.replaceAll(ClassRX, ".");
  s = s.replaceAll(TagRX, "x");

  function calcPrecedence(str) {
    let ids = str.match(/#/g)?.length || 0;
    let classes = str.match(/\./g)?.length || 0;
    let elements = str.match(/x/g)?.length || 0;
    return ids * 1_000_000 + classes * 1_000 + elements;
  }
  s = s.replaceAll(/[#.x]+/g, calcPrecedence);

  for (let m; m = s.match(PseudoRX2);) {
    let innerNums = m[2].match(/\d+/g);
    let max = (m[1] === "where" || !innerNums) ? "" : Math.max(...innerNums.map(Number));
    s = s.replaceAll(m[0], " " + max + " ");
  }
  return s.match(/\d+/g).map(Number).reduce((a, b) => a + b, 0);
}

export function GetComputedStyleRaw(SHEETS = document.styleSheets) {

  function getAllRules(sheets) {

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

    function flattenRules(rules, ctx = {}, flatRules = [], layers = new Set()) {
      for (const rule of rules) {
        if (rule instanceof CSSLayerStatementRule)
          for (let name of rule.nameList)
            layers.add(ctx.layer ? `${ctx.layer}.${name}` : name);
        else if (rule.selectorText && rule.style)
          flatRules.push({ ...ctx, rule });
        else {
          const nextCtx = makeInnerCtx(ctx, rule);
          if (nextCtx.layer != ctx.layer)
            layers.add(nextCtx.layer);
          let innerRules = rule.cssRules;
          if (rule.styleSheet)
            try { innerRules = rule.styleSheet.cssRules } catch { }
          if (innerRules?.length)
            flattenRules(innerRules, nextCtx, flatRules, layers);
        }
      }
      return { flatRules, layers };
    }

    const rules = [];
    for (let sheet of sheets)
      try { rules.push(...sheet.cssRules); } catch (e) { }
    return flattenRules(rules);
  }

  const PSEUDO = /(.*?)(::[a-z-]+)((:[a-z-]+)*)$/i;
  function prepRules(allRules, layers) {
    for (let r of allRules) {
      const pseudo = r.rule.selectorText.match(PSEUDO);
      r.pseudo = pseudo?.[2];
      r.selector = pseudo ? pseudo[1] + (pseudo[3] || "") : r.rule.selectorText;
      r.priority = ((layers.indexOf(r.layer) + 1) * 100_000_000) + selectorSpecificity(r.selector);
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

  const { flatRules, layers } = getAllRules(SHEETS);
  const rulesSorted = prepRules(flatRules, [...layers, undefined]);
  const allRules = rulesSorted.filter(r =>
    (!r.media || matchMedia(r.media).matches) && (!r.supports || CSS.supports(r.supports)))
  const RULES = {};
  for (let r of allRules)
    (RULES[r.pseudo || ""] ??= []).push(r);

  return function getComputedStyleRaw(el, pseudo = "") {
    const res = assignStyle({}, el.style, undefined);
    for (let r of RULES[pseudo] ?? [])
      if (el.matches(r.selector))
        assignStyle(res, r.rule.style, r.layer);
    assignStyle(res, el.style, undefined);
    return Object.fromEntries(Object.entries(res).map(([k, v]) => [k, v.value]));
  }
}