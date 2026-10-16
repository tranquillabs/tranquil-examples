// Tranquil automation. Rules for writing and changing it: ~/.tranquil/llm/writing-automations.md
// Scrape a few page stats and open them as a text file in the editor.
// @permissions page-js write=page-info.txt
import { files, tabs, ui } from "tranquil/automation";

const tab = await tabs.active();
const stats = await tab.evaluate((page) => {
  const links = page.document.querySelectorAll("a").length;
  const images = page.document.querySelectorAll("img").length;
  const headings = page.document.querySelectorAll("h1,h2,h3").length;
  return `${page.document.title}\n\nLinks: ${links}  |  Images: ${images}  |  Headings: ${headings}`;
});
await ui.open(files.write("page-info.txt", stats));
