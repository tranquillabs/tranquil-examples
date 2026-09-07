// Labels every image on the page with its rendered size, pinned to the image's top-left corner.
//
// The point of this example is the SHAPE, not the labels. Any automation that measures a page and
// then puts something on it has to do all the measuring first and all the placing second.
//
// Why: `tab.evaluate` runs on the page's own main thread — the same one the page uses for layout,
// paint and input. Reading a layout value (getBoundingClientRect, offsetWidth, scrollY) forces the
// browser to compute layout right then, so it can answer you. Inserting an element invalidates
// that layout. Interleave the two and every read pays for a fresh layout of the whole document:
//
//   for (const img of images) {            // 🔴 one full layout PER IMAGE
//     const r = img.getBoundingClientRect();  //    read  — needs layout
//     document.body.appendChild(tagFor(r));   //    write — invalidates it again
//   }
//
// Measuring all of them first and placing all of them after costs one layout for the whole run,
// however many images there are. On a long article that is the difference between a script that
// finishes instantly and one that visibly hangs the page it is working on.
// @permissions browser
import { tabs, ui } from "tranquil/automation";

const tab = await tabs.active();

const tagged = await tab.evaluate<number>((minSize: number) => {
  // Re-runnable: clear the previous run's labels before measuring, so their own boxes never end
  // up in the numbers. This is a write, so it costs the one forced layout that the first read
  // below pays for — one, at a known place, rather than one per image.
  document.querySelectorAll(".tq-size-tag").forEach((el) => el.remove());

  // ---- PASS 1: reads only ---------------------------------------------------------------
  // Page-level values are the same for every label, so read them once instead of per image —
  // the same reason as hoisting anything else out of a loop, except the cost here is layout.
  const scrollX = globalThis.scrollX;
  const scrollY = globalThis.scrollY;

  const plans: { top: number; left: number; label: string }[] = [];
  for (const img of document.querySelectorAll<HTMLImageElement>("img")) {
    const r = img.getBoundingClientRect();
    // Skip tracking pixels, spacers and icons — a label bigger than its image helps nobody.
    if (r.width < minSize || r.height < minSize) continue;
    plans.push({
      // getBoundingClientRect is viewport-relative; adding the scroll offset makes these page
      // coordinates, so the labels stay on their images when you scroll.
      top: r.top + scrollY,
      left: r.left + scrollX,
      label: `${Math.round(r.width)}×${Math.round(r.height)}`,
    });
  }

  // ---- PASS 2: writes only --------------------------------------------------------------
  // Nothing below reads geometry, so the browser can batch the whole lot into a single layout
  // and paint. (The fragment is tidiness more than speed — one insertion instead of N reads
  // better; it is the read/write split above that does the actual work.)
  const frag = document.createDocumentFragment();
  for (const p of plans) {
    const tag = document.createElement("span");
    tag.className = "tq-size-tag";
    tag.textContent = p.label;
    tag.style.cssText = "position:absolute;z-index:2147483647;padding:2px 5px;" +
      "background:#1f2937;color:#fff;font:11px/1.4 ui-monospace,SFMono-Regular,monospace;" +
      "border-radius:0 0 4px 0;pointer-events:none;white-space:nowrap;" +
      `top:${p.top}px;left:${p.left}px`;
    frag.appendChild(tag);
  }
  document.body.appendChild(frag);

  return plans.length;
}, 40);

await ui.notify(
  tagged
    ? `Measured and labelled ${tagged} image(s). Re-run to refresh, reload the page to clear.`
    : "No images big enough to label on this page.",
  { level: tagged ? "success" : "info" },
);
