// Rough "reader mode": hide common clutter and widen the main column.
// @permissions browser
import { tabs } from "tranquil/automation";

const tab = await tabs.active();
await tab.evaluate(() => {
  document
    .querySelectorAll<HTMLElement>('header, footer, aside, nav, [role="banner"]')
    .forEach((el) => {
      el.style.display = "none";
    });
  const main = document.querySelector<HTMLElement>("main, article") || document.body;
  main.style.maxWidth = "720px";
  main.style.margin = "0 auto";
  main.style.fontSize = "18px";
  main.style.lineHeight = "1.6";
});
