// Scrape a few page stats and open them as a text file in the editor.
// @permissions browser
import { files, tabs, ui } from "tranquil/automation";

const tab = await tabs.active();
const stats = await tab.evaluate(() => {
  const links = document.querySelectorAll("a").length;
  const images = document.querySelectorAll("img").length;
  const headings = document.querySelectorAll("h1,h2,h3").length;
  return `${document.title}\n\nLinks: ${links}  |  Images: ${images}  |  Headings: ${headings}`;
});
await ui.open(files.write("page-info.txt", stats));
