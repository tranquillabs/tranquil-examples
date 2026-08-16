// Outline every external link on the active page.
// @permissions browser
import { tabs } from "tranquil/automation";

const tab = await tabs.active();
await tab.evaluate(() => {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]').forEach((a) => {
    a.style.outline = "2px solid orange";
  });
});
