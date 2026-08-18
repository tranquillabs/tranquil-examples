// Builds and maintains spices.json across runs — create it, read it back, update entries, delete
// one. Every other example here is write-once; this one owns a file and edits it, which is the
// shape most automations take once you run them more than once.
//
// Run it repeatedly: the first run scrapes and fills the catalogue, later runs find nothing to do.
// Delete spices.json to start over, or blank a record's "url" to make it refetch just that spice.
//
// The two file grants name the one file this script owns. There is no implicit access to its own
// folder, so even reading a sibling has to be asked for.
// @permissions browser read=spices.json write=spices.json

import { files, tabs, ui } from "tranquil/automation";

type Spice = {
  name: string;
  url: string | null;
  summary: string | null;
  checkedAt: string | null;
};

const CATALOGUE = "spices.json";
const LIST_PAGE = "https://en.wikipedia.org/wiki/List_of_Indian_spices";
const WANTED = 5;

const save = (spices: Spice[]) => files.write(CATALOGUE, JSON.stringify(spices, null, 2) + "\n");

// ---- READ -----------------------------------------------------------------
// Missing file is the normal first-run state, not an error: the catch is what makes the same
// script both create and maintain.
let spices: Spice[] = [];
try {
  spices = JSON.parse(files.read(CATALOGUE));
  await ui.notify(`READ — ${spices.length} spice(s) already on file.`);
} catch {
  await ui.notify("READ — no catalogue yet; this run will create one.");
}

const tab = await tabs.active();

// ---- CREATE ---------------------------------------------------------------
if (spices.length === 0) {
  await ui.notify("CREATE — scraping the spice list…");
  await tab.goto(LIST_PAGE, { waitUntil: "load" });
  await tab.waitFor("table.wikitable");

  const names = await tab.evaluate<string[]>((wanted: number) => {
    // The list lives in the one wikitable on the page; column 2 is "Standard English".
    const rows = document.querySelectorAll("table.wikitable tbody tr");
    const out: string[] = [];
    for (const row of rows) {
      const cell = row.querySelectorAll("td")[1];
      // Some entries read "Bay leaf, Indian bay leaf" — keep the first name only.
      const name = (cell?.textContent || "").trim().split(",")[0].trim();
      if (name) out.push(name);
      if (out.length >= wanted) break;
    }
    return out;
  }, WANTED);

  spices = names.map((name) => ({ name, url: null, summary: null, checkedAt: null }));
  save(spices);
  await ui.notify(`CREATE — ${spices.length} spice(s) written to ${CATALOGUE}.`);
}

// ---- UPDATE ---------------------------------------------------------------
// Only records still missing a url, so a second run is a no-op and an interrupted run resumes.
const pending = spices.filter((s) => !s.url);
if (pending.length === 0) {
  await ui.notify("UPDATE — every spice already has details; nothing to do.");
} else {
  await ui.notify(`UPDATE — looking up ${pending.length} spice(s)…`);
  for (const spice of pending) {
    // Wikipedia's search jumps straight to the article when the title matches exactly — but only
    // then. "Alkanet root" has no article of its own and lands on a results page instead, so the
    // script has to cope with both landings rather than assuming the redirect.
    await tab.goto(
      "https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(spice.name),
      { waitUntil: "load" },
    );
    // A predicate, not a selector: wait for whichever page we got.
    await tab.waitFor(() =>
      !!document.querySelector(".mw-parser-output p, .mw-search-result-heading a")
    );

    // On a results page, follow the top hit ("Alkanet root" → "Alkanna tinctoria").
    const firstHit = await tab.evaluate<string | null>(() => {
      if (document.querySelector(".mw-parser-output p")) return null; // already an article
      const link = document.querySelector<HTMLAnchorElement>(".mw-search-result-heading a");
      return link ? link.href : null;
    });
    if (firstHit) {
      await tab.goto(firstHit, { waitUntil: "load" });
      await tab.waitFor(".mw-parser-output p");
    }

    const found = await tab.evaluate<{ url: string; summary: string }>(() => {
      // Not just `querySelector('p').textContent`: Wikipedia injects TemplateStyles <style> tags
      // and citation markup INSIDE the first paragraph, so a raw read returns CSS or a stray
      // {{cite}} template. Clone the node, strip the furniture, then read the text — and skip
      // paragraphs too short to be the lede.
      // Descendant, not `> p`: Wikipedia wraps article content in <section> elements, so the
      // paragraphs are grandchildren of .mw-parser-output and a child combinator matches nothing.
      for (const p of document.querySelectorAll(".mw-parser-output p")) {
        const clone = p.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("style, sup.reference, .mw-editsection").forEach((n) => n.remove());
        const text = (clone.textContent || "").replace(/\s+/g, " ").trim();
        if (text.length > 80) return { url: location.href, summary: text.slice(0, 300) };
      }
      return { url: location.href, summary: "" };
    });

    spice.url = found.url;
    spice.summary = found.summary || null;
    spice.checkedAt = new Date().toISOString();

    // Save after each spice, not once at the end: cancel the run halfway (see slow-count) and
    // everything already looked up survives.
    save(spices);
    await ui.notify(`UPDATE — ${spice.name}`);
  }
}

// ---- DELETE ---------------------------------------------------------------
// Prefer dropping a record that came back without a summary — a real reason to remove it. If they
// all succeeded, drop the last so the operation is still demonstrated.
const doomed = spices.find((s) => !s.summary) ?? spices[spices.length - 1];
if (doomed) {
  spices = spices.filter((s) => s !== doomed);
  save(spices);
  await ui.notify(`DELETE — removed "${doomed.name}"; ${spices.length} left.`, {
    level: "success",
  });
}

await ui.open(files.write(CATALOGUE, JSON.stringify(spices, null, 2) + "\n"));
