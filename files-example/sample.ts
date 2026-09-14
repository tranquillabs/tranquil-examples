// A plain TypeScript file — here to show the icon and syntax highlighting.
// Unlike every other .ts file in this repo, this one is NOT a runnable automation
// (no `tranquil/automation` import, no `@permissions` header). Cmd-Shift-R won't do anything useful here.

interface Point {
  x: number;
  y: number;
}

function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
