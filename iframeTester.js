function runInside() {
  function Debounce(fn, delay = 50) {
    let timeoutId, rafId;

    function _go(id, ...args) {
      if (id !== timeoutId) return;
      timeoutId = clearTimeout(id);
      rafId = cancelAnimationFrame(rafId);
      fn(...args);
    }

    return function debounced(...args) {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
      let escapedMicrotaskRaceConditionId;
      escapedMicrotaskRaceConditionId = timeoutId = setTimeout(_ => _go(escapedMicrotaskRaceConditionId, ...args), delay);
      rafId = requestAnimationFrame(_ => queueMicrotask(_ => queueMicrotask(_ => _go(escapedMicrotaskRaceConditionId, ...args))));
    };
  }

  const report = Debounce(_ => parent.postMessage(document.documentElement.outerHTML, '*'));
  const mo = new MutationObserver(report);
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
}

export function runTest(txt, insideScript = runInside) {
  const iframe = document.createElement("iframe");

  const messages = [];
  let wakeUp;
  window.addEventListener("message", e => e.source === iframe.contentWindow && messages.push(e.data) && wakeUp?.());
  const results = async function* () {
    while (true) {
      if (messages.length === 0)
        await new Promise(r => wakeUp = r);
      wakeUp = null;
      yield messages.shift();
    }
  }();

  const innerScript = `<script>(${insideScript.toString()})();document.currentScript.remove();</script>`;
  iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(txt + innerScript)}`;
  document.body.appendChild(iframe);
  return { iframe, results };
}