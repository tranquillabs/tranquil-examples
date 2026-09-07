# measure-and-place

Labels every image on the active page with its rendered size, pinned to the image's top-left
corner. Re-run it to refresh the labels; reload the page to clear them.

The labels are the excuse. This example exists for the shape of the script, which is the one every
automation that **measures a page and then changes it** has to use.

## Why the two passes

`tab.evaluate` runs on the page's own main thread — the same single thread the page uses for
layout, paint and input. Two things follow from that:

- Reading a layout value (`getBoundingClientRect`, `offsetWidth`, `scrollY`) forces the browser to
  compute layout *right then*, so it has an answer for you.
- Inserting or moving an element invalidates that layout.

Interleave them and every read pays for a fresh layout of the entire document:

```ts
for (const img of images) {              // 🔴 one full layout PER IMAGE
  const r = img.getBoundingClientRect(); //    read  — needs layout
  document.body.appendChild(tagFor(r));  //    write — invalidates it again
}
```

Measure everything first, place everything second, and the whole run costs one layout no matter how
many images there are:

```ts
const plans = [];
for (const img of images) plans.push(measure(img));  // 🟢 all reads
for (const p of plans) frag.appendChild(tagFor(p));  // 🟢 all writes
document.body.appendChild(frag);
```

On a page with a handful of images you will not notice. On a long article you are freezing someone
else's page while your script runs, and the automation waits on it too — `evaluate` doesn't return
until the page's main thread is free again.

The same rule applies to the page-level reads. `scrollX` and `scrollY` are identical for every
label, so they are read once above the loop rather than per image.

## Worth knowing

- `getBoundingClientRect` is **viewport**-relative. Adding the scroll offset turns it into page
  coordinates, which is what `position: absolute` wants — otherwise the labels drift as you scroll.
- Clearing the previous run's labels happens *before* the measuring pass, so their own boxes never
  end up in the numbers.
- The `DocumentFragment` is tidiness more than speed — one insertion instead of many reads better,
  but it is the read/write split that does the real work.

Open a page with images in a browser tab, focus `measure-and-place.ts`, and press `Cmd-Shift-R`.

Declares `// @permissions browser`, so the first run asks for approval once.
See the [Writing Automations guide](https://www.tranquillabs.dev/docs/guides/writing-automations/).
