# James Cafe Capsule Giveaway

A bilingual capsule-toy raffle for James Cafe at AI Dev Day Tokyo 2026. The
site is entirely static: GitHub Issues collect entries, GitHub Actions validate
and append them to `data/entries.json`, and GitHub Pages redeploys the machine.

## Entry flow

1. A visitor enters their name and opens the prefilled GitHub Issue.
2. `.github/workflows/process-entry.yml` validates and adds the entry.
3. The issue is closed and Pages redeploys with the new capsule.
4. The host uses **Draw winner** to select an entry with browser cryptographic
   randomness.

## Local preview

Serve the directory with any static server, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.
