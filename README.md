# Resume

A resume written in HTML/CSS and printed to an A4 PDF with Puppeteer.

## Usage

```sh
npm install
npm run dev   # live preview at http://localhost:5173 (hot-reloads on edits)
npm run pdf   # builds and writes out/kenneth-ho-resume.pdf
```

## Where things live

| What | File |
| --- | --- |
| All content (roles, bullets, skills, contact) | `src/data/resume.json` |
| Colours, type scale, page geometry | `src/styles/tokens.css` |
| Layout and components | `src/styles/screen.css` |
| Print / `@page` rules | `src/styles/print.css` |
| Markup template | `src/main.js` |
| PDF export | `scripts/pdf.mjs` |
| Source material (LinkedIn export) | `docs/` |

## Notes

- **Private details:** any `src/data/*.local.json` file is gitignored and shallow-merges over `resume.json`. For example, a `contact.local.json` containing `{ "contact": [...] }` keeps your phone and email out of git.
- **Dark theme:** tokens already exist. Set `<html data-theme="dark">` in `index.html` to try it.
- **ATS:** bullets use native list markers rather than positioned pseudo-elements. Positioned elements reorder the PDF text layer, which breaks reading order for ATS parsers.
- **Length:** a role never splits across pages (`break-inside: avoid`). If an edit pushes it past 2 pages, trim bullets or tighten `--fs-body` / `--lh` in `tokens.css`.
