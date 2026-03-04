# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-03-04

- Add `scripts/make-gifs.js` — a Playwright-driven script that builds the project, starts a temporary preview server, captures browser screenshots, and encodes them into animated GIFs saved to `docs/gifs/` (`c4-tabs.gif`, `c4-examples.gif`, `c4-toggle.gif`); add `npm run make-gifs` script; document usage in README

## 2026-03-02

- Convert navigation controls to proper `<a>` hyperlinks; add view-state URL tracking — example selector, level tabs, and Diagram/Code toggle are now real links, making every view bookmarkable and shareable ([#19](https://github.com/NguyenAndrew/Tooda/pull/19))
- Add per-example deep links on the home page, each pointing directly to a specific C4 example via `?example=` query param ([#18](https://github.com/NguyenAndrew/Tooda/pull/18))
- Add MIT LICENSE file ([#18](https://github.com/NguyenAndrew/Tooda/pull/18))
- Make example selection on the C4 page URL-driven via `?example=` query param, with `popstate` support for back/forward navigation ([#18](https://github.com/NguyenAndrew/Tooda/pull/18))
- Add diagram/code view toggle to C4 page — a "Diagram / Code" button row lets users inspect the raw Mermaid source behind any rendered C4 diagram ([#17](https://github.com/NguyenAndrew/Tooda/pull/17))
- Add E-Commerce and Ride-Sharing C4 diagram examples — two additional complete C4 walkthroughs (all four levels) alongside the original Online Banking System ([#16](https://github.com/NguyenAndrew/Tooda/pull/16))
- Fix Level 4 class diagram rendering — scope the initial `mermaid.run()` call to the active panel only so hidden panels render lazily, eliminating the "Syntax error in text" error ([#14](https://github.com/NguyenAndrew/Tooda/pull/14))
- Remove Playwright MCP server from Copilot agent configuration; retain GitHub MCP server ([#11](https://github.com/NguyenAndrew/Tooda/pull/11))
- Add Playwright UI end-to-end tests covering both pages, tab switching, and diagram rendering; add `test` npm script and CI workflow ([#9](https://github.com/NguyenAndrew/Tooda/pull/9))
- Fix dev script in `package.json` to copy Mermaid before starting the dev server; update README with correct dev server URL ([#8](https://github.com/NguyenAndrew/Tooda/pull/8))
- Create extensive README covering overview, features, tech stack, getting started, project structure, pages & routes, diagram types, deployment, contributing, and license ([#7](https://github.com/NguyenAndrew/Tooda/pull/7))
- Disable Astro telemetry in CI workflows ([#6](https://github.com/NguyenAndrew/Tooda/pull/6))
- Add URL hash-based routing for C4 diagram levels — individual levels can now be linked to directly via `#level1`–`#level4` ([#5](https://github.com/NguyenAndrew/Tooda/pull/5))
- Fix Level 4 `classDiagram` syntax error caused by `[]` inside `~~` generic notation, which Mermaid 11.12.3 rejects ([#4](https://github.com/NguyenAndrew/Tooda/pull/4))
- Fix Mermaid diagrams not rendering and tab switching broken on C4 page — add `copy-mermaid.js` step to the CI workflow and switch to an explicit `mermaid.run()` call ([#3](https://github.com/NguyenAndrew/Tooda/pull/3))
- Add C4 diagram example with all four levels (Context, Container, Component, Code) for an Online Banking System, rendered via Mermaid.js with a tabbed UI ([#2](https://github.com/NguyenAndrew/Tooda/pull/2))
- Add Astro v5 Hello World static site with GitHub Pages deployment pipeline ([#1](https://github.com/NguyenAndrew/Tooda/pull/1))

