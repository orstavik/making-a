const nonLogical = {
  'horizontal-tb': { top: "block-start", left: "inline-start", right: "inline-end", bottom: "block-end", },
  'vertical-rl': { top: "inline-start", left: "block-end", right: "block-start", bottom: "inline-end", },
  'vertical-lr': { top: "inline-start", left: "block-start", right: "block-end", bottom: "inline-end", },
  'sideways-lr': { top: "inline-end", left: "block-start", right: "block-end", bottom: "inline-start", },
  'rtl|horizontal-tb': { top: "block-start", left: "inline-end", right: "inline-start", bottom: "block-end" },
  'rtl|vertical-rl': { top: "inline-end", left: "block-end", right: "block-start", bottom: "inline-start" },
  'rtl|vertical-lr': { top: "inline-end", left: "block-start", right: "block-end", bottom: "inline-start" },
  'rtl|sideways-lr': { top: "inline-start", left: "block-start", right: "block-end", bottom: "inline-end" },
};
const nonLogicalRadius = {
  'sideways-lr': { "top-left": "start-start", "top-right": "end-start", "bottom-left": "start-end", "bottom-right": "end-end" },
  'horizontal-tb': { "top-left": "start-start", "top-right": "start-end", "bottom-left": "end-start", "bottom-right": "end-end", },
  'vertical-rl': { "top-left": "end-start", "top-right": "start-start", "bottom-left": "end-end", "bottom-right": "start-end", },
  'vertical-lr': { "top-left": "start-start", "top-right": "end-start", "bottom-left": "start-end", "bottom-right": "end-end", },
  'rtl|horizontal-tb': { "top-left": "start-end", "top-right": "start-start", "bottom-left": "end-end", "bottom-right": "end-start" },
  'rtl|vertical-rl': { "top-left": "end-end", "top-right": "start-end", "bottom-left": "end-start", "bottom-right": "start-start" },
  'rtl|vertical-lr': { "top-left": "start-end", "top-right": "end-end", "bottom-left": "start-start", "bottom-right": "end-start" },
  'rtl|sideways-lr': { "top-left": "start-end", "top-right": "end-end", "bottom-left": "start-start", "bottom-right": "end-start", },
};
const nonLogicalDirections = {
  'sideways-lr': { x: "inline", y: "block", },
  'horizontal-tb': { x: "block", y: "inline", },
  'vertical-rl': { x: "block", y: "inline", },
  'vertical-lr': { x: "inline", y: "block", },
  'rtl|horizontal-tb': { x: "inline", y: "block", },
  'rtl|vertical-rl': { x: "block", y: "inline", },
  'rtl|vertical-lr': { x: "block", y: "inline", },
  'rtl|sideways-lr': { x: "inline", y: "block", },
};
const PhysicalToLogicalValues = {};
for (let [n, t] of Object.entries(nonLogicalDirections))
  PhysicalToLogicalValues[n] = { ...t, horizontal: t.x, vertical: t.y, ...nonLogical[n] };
PhysicalToLogicalValues["sideways-rl"] = PhysicalToLogicalValues["vertical-rl"];

function makeLogicalValue(k, v, map) {
  if (typeof v !== "string") return v;
  if (!["float", "clear", "caption-side", "scroll-snap-type", "resize", "text-align"].includes(k)) return v;
  //todo i think that we need (space|^|$) infront or behind instead of \b..
  v = v.replace(/\b(left|right|top|bottom|x|y|horizontal|vertical)\b/g, m => map[m] ?? m); //todo can replace inside () and ""?
  if (k === "text-align")
    v = v.split("-").pop();
  return v;
}

const PhysicalToLogical = {};
for (const [writingMode, table] of Object.entries(nonLogical)) {
  PhysicalToLogicalValues[writingMode] = { ...nonLogicalDirections[writingMode], ...table };
  const res = PhysicalToLogical[writingMode] = {};
  for (const [physical, logical] of Object.entries(table)) {
    res[physical] = "inset-" + logical;
    for (const prefix of ["border", "margin", "padding", "scroll-margin", "scroll-padding"])
      res[prefix + "-" + physical] = prefix + "-" + logical;
    for (const suffix of ["color", "style", "width"])
      res["border-" + physical + "-" + suffix] = "border-" + logical + "-" + suffix;
  }
  for (const [physical, logical] of Object.entries(nonLogicalRadius[writingMode]))
    res["border-" + physical + "-radius"] = "border-" + logical + "-radius";
};
PhysicalToLogical["sideways-rl"] = PhysicalToLogical["vertical-rl"];

export function physicalToLogicalCss(styles) {
  const writingMode = styles["writing-mode"] ?? "horizontal-tb";
  const map = PhysicalToLogical[writingMode];
  const valueMap = PhysicalToLogicalValues[writingMode];
  const res = {};
  for (let [k, v] of Object.entries(styles))
    res[map[k] ?? k] = makeLogicalValue(k, v, valueMap);
  return res;
}