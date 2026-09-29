# spice-catalogue

Builds and maintains `spices.json` across runs — the only example here that **owns a file and edits
it**. Everything else produces output once and stops; this is the shape automations take when you
run them more than once.

Run it repeatedly and watch `spices.json` change in the tree:

| stage | what happens |
| --- | --- |
| **READ** | Load `spices.json`, or start empty if it isn't there yet |
| **CREATE** | First run only — scrape 5 spices from Wikipedia's list of Indian spices |
| **UPDATE** | For each spice still missing details, open its article and record the URL and summary |
| **DELETE** | Drop one record and rewrite the file |

The Runs panel narrates each stage, so you can see which path a given run took.

## Things worth stealing

**The missing file is not an error.** `files.read` throws when the catalogue doesn't exist, and the
`catch` treats that as "first run" rather than a failure. That one branch is what lets a single
script both create and maintain.

**It saves after every spice, not at the end.** Cancel the run halfway through the UPDATE loop and
everything already looked up survives — try it, then run again and it picks up exactly where it
stopped. Only records missing a `url` are fetched, so a second run on a complete catalogue does
nothing at all.

**The search doesn't always land where you expect.** Wikipedia jumps straight to the article when
the title matches exactly — but only then. `Alkanet root` has no article of its own and lands on
a results page, so the script waits on a *predicate* matching either page, and follows the top
hit when it got results (`Alkanet root` → `Alkanna tinctoria`). Assuming the redirect is the
obvious mistake, and it fails on the very first spice.

**Scraping needs DOM surgery, not just a selector.** Wikipedia injects TemplateStyles `<style>` tags
and citation markup *inside* the first paragraph, so `querySelector("p").textContent` returns CSS or
a stray `{{cite}}` template rather than prose. The callback clones the node, strips
`style, sup.reference, .mw-editsection`, then reads the text — and skips paragraphs too short to be
the lede. `tab.evaluate` gives you the whole DOM to work in, which is the point.

To watch a single spice refetch, blank its `"url"` in `spices.json` and run again. To start over,
delete the file.

## Permissions

```ts
// @permissions browser read=spices.json write=spices.json
```

`browser` to drive the tab, and the two file grants name the single file this script owns — nothing
else beside it is readable or writable. A script has no implicit access to its own folder, so even
`spices.json` sitting next to the script has to be asked for by name.

Scraping is against a live site, so the selectors (`table.wikitable`, `.mw-parser-output p`) will
need updating if Wikipedia changes its markup — today the list page has exactly one `wikitable`,
and article paragraphs sit inside `<section>` wrappers, which is why that second selector is a
descendant match rather than a child one.

See the [Writing Automations guide](https://www.tranquillabs.dev/docs/writing-automations/).
