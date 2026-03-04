# Tooda

> **Too**l for **d**i**a**grams — a lightweight, browser-based tool for creating and maintaining architecture and design diagrams using the [C4 model](https://c4model.com/), [Mermaid](https://mermaid.js.org/), and [Excalidraw](https://excalidraw.com/).

[![Deploy to GitHub Pages](https://github.com/NguyenAndrew/Tooda/actions/workflows/deploy.yml/badge.svg)](https://github.com/NguyenAndrew/Tooda/actions/workflows/deploy.yml)

🌐 **Live site:** <https://nguyenandrew.github.io/Tooda>

---

## Table of Contents

- [Screenshots](#screenshots)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
  - [Preview Build](#preview-build)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [Diagram Types](#diagram-types)
  - [C4 Model Diagrams (Mermaid)](#c4-model-diagrams-mermaid)
  - [Class Diagrams](#class-diagrams)
  - [Excalidraw Diagrams](#excalidraw-diagrams)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

---

## Screenshots

**Landing page** — jump straight into any example system:

![Landing page](https://github.com/user-attachments/assets/f14f4d8f-3598-4a2c-ab34-06641b314546)

**Excalidraw viewer** — freehand-style diagrams rendered with Excalidraw:

![Excalidraw viewer – Healthcare Platform Context](https://github.com/user-attachments/assets/bc2f227b-37cd-4c30-8f77-e60dacb7c61d)

---

## Overview

Tooda makes it easy to **visualize software architecture** directly in the browser — no desktop app or proprietary format required. Diagrams are written as plain text using Mermaid's diagram syntax and rendered on the fly, so they live alongside your code and can be version-controlled like any other file. Freehand-style diagrams are also supported via [Excalidraw](https://excalidraw.com/).

The current showcase includes three complete C4 model walkthroughs — **Online Banking**, **E-Commerce**, and **Ride-Sharing** systems — each illustrated across all four levels of the [C4 model](https://c4model.com/), plus a **Healthcare Platform** example rendered with Excalidraw. All of these are ready-to-adapt templates for your own projects.

---

## Features

- 📐 **C4 model support** — Context, Container, Component, and Code (class) diagrams out of the box
- 🎨 **Excalidraw support** — freehand-style diagrams rendered with Excalidraw for a more visual, whiteboard feel
- 🧜 **Mermaid rendering** — C4 diagrams are defined as text and rendered in the browser; no image assets to manage
- 🗂️ **Tabbed diagram viewer** — switch between C4 levels with a single click; the active tab is bookmarkable via URL hash
- 🔗 **URL-driven navigation** — example selection and active level are encoded in the URL (`?example=banking#level1`), making every view bookmarkable, shareable, and supporting browser back/forward
- 💻 **Diagram / Code toggle** — inspect the raw Mermaid source behind any rendered C4 diagram with a single click
- 🌍 **Multiple built-in examples** — Online Banking, E-Commerce, Ride-Sharing (C4/Mermaid) and Healthcare Platform (Excalidraw) ship out of the box
- 🌑 **Dark-themed UI** — comfortable for long design sessions
- ⚡ **Static site** — built with [Astro](https://astro.build/), meaning zero client-side JavaScript framework overhead; extremely fast to load and easy to host
- 🚀 **Automatic deployment** — GitHub Actions pipeline builds and deploys to GitHub Pages on every push to `main`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Site framework | [Astro](https://astro.build/) v5 |
| Diagram engine (C4) | [Mermaid](https://mermaid.js.org/) v11 |
| Diagram engine (freehand) | [Excalidraw](https://excalidraw.com/) |
| UI components | [React](https://react.dev/) v18 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v3 |
| Language | TypeScript (strict) |
| Package manager | npm |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v20 or later** (v22 recommended)
- npm (bundled with Node.js)

### Installation

```bash
git clone https://github.com/NguyenAndrew/Tooda.git
cd Tooda
npm install
```

### Development Server

```bash
npm run dev
```

Starts a local dev server at `http://localhost:4321/Tooda` in the background (detached). Logs are written to `dev-detach.log`. Changes to `.astro` files are reflected instantly in the browser.

To run the dev server in the foreground instead, use:

```bash
npm run dev:attach
```

### Production Build

```bash
npm run build
```

This runs two steps automatically:

1. **`scripts/copy-mermaid.js`** — copies `mermaid.min.js` from `node_modules` into the `public/` folder so it is bundled with the static output.
2. **`astro build`** — compiles the Astro site into the `dist/` directory, ready for deployment.

### Preview Build

```bash
npm run preview
```

Serves the production build locally so you can verify it before deploying.

---

## Project Structure

```text
Tooda/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build & deploy to GitHub Pages
├── scripts/
│   ├── copy-mermaid.js         # Pre-build helper: copies Mermaid bundle to public/
│   └── dev-detach.js           # Starts the dev server detached in the background
├── src/
│   ├── components/
│   │   └── ExcalidrawViewer.tsx # React component that renders an Excalidraw canvas
│   ├── pages/
│   │   ├── index.astro          # Landing page with links to all examples
│   │   ├── c4.astro             # C4 diagram viewer (all 4 levels, multiple examples)
│   │   └── excalidraw.astro     # Excalidraw freehand diagram viewer
│   └── utils/
│       └── logger.ts            # Structured browser/Node console logger
├── tests/
│   ├── index.spec.ts            # Playwright tests for the landing page
│   ├── c4.spec.ts               # Playwright tests for the C4 viewer
│   ├── excalidraw.spec.ts       # Playwright tests for the Excalidraw viewer
│   └── performance.spec.ts      # Playwright performance tests
├── astro.config.mjs             # Astro configuration (site URL, base path, integrations)
├── package.json
├── package-lock.json
└── tsconfig.json                # TypeScript config (extends astro/tsconfigs/strict)
```

---

## Pages & Routes

| Route | File | Description |
|---|---|---|
| `/Tooda/` | `src/pages/index.astro` | Landing page with links to all diagram examples |
| `/Tooda/c4` | `src/pages/c4.astro` | Interactive C4 diagram viewer with tabbed navigation and multiple examples (`?example=banking`, `?example=ecommerce`, `?example=ridesharing`) |
| `/Tooda/excalidraw` | `src/pages/excalidraw.astro` | Excalidraw freehand diagram viewer (Healthcare Platform, all four C4 levels) |

> **Note:** The `/Tooda` base path is set in `astro.config.mjs` to match the GitHub Pages repository sub-path.

---

## Diagram Types

### C4 Model Diagrams (Mermaid)

The C4 model provides a hierarchical way to describe software architecture using four levels of abstraction. Three complete examples ship with Tooda — **Online Banking**, **E-Commerce**, and **Ride-Sharing** — each available at `/Tooda/c4?example=banking|ecommerce|ridesharing`.

| Level | Mermaid Keyword | What it shows |
|---|---|---|
| **Level 1 – Context** | `C4Context` | The system and the people/external systems that interact with it |
| **Level 2 – Container** | `C4Container` | The applications, services, and data stores that make up the system |
| **Level 3 – Component** | `C4Component` | The internal components (controllers, services, modules) inside a container |
| **Level 4 – Code** | `classDiagram` | Key classes and interfaces that implement a component |

Example — Level 1 Context snippet:

```text
C4Context
  title System Context – Online Banking System

  Person(customer, "Personal Banking Customer", "A customer of the bank.")
  System(onlineBanking, "Online Banking System", "Allows customers to view accounts and make payments.")
  System_Ext(mainframe, "Mainframe Banking System", "Stores core banking data.")

  Rel(customer, onlineBanking, "Uses")
  Rel(onlineBanking, mainframe, "Reads/writes account data")
```

### Class Diagrams

Level 4 diagrams use Mermaid's `classDiagram` syntax to document key classes, their fields, methods, and relationships:

```text
classDiagram
  class AccountsService {
    -accountsRepository: AccountsRepository
    +getBalance(customerId: string) Promise~Account~
  }
  AccountsService --> AccountsRepository : uses
```

### Excalidraw Diagrams

The Excalidraw viewer (`/Tooda/excalidraw`) renders freehand-style diagrams using [Excalidraw](https://excalidraw.com/). The built-in example is a **Healthcare Platform** illustrated across all four C4 levels. Diagram elements are defined as structured data in `excalidraw.astro` and passed to the `ExcalidrawViewer` React component.

Each panel includes:
- **Edit / View toggle** — switch between read-only and full interactive editing
- **Export JSON** — download the current diagram as an Excalidraw-compatible JSON file

---

## Deployment

Tooda is deployed automatically to **GitHub Pages** via the workflow defined in `.github/workflows/deploy.yml`. The pipeline triggers on every push to the `main` branch:

1. **Checkout** the repository
2. **Setup Node.js** (v22)
3. **Install dependencies** with `npm ci`
4. **Disable Astro telemetry**
5. **Build** with `npm run build` (copies Mermaid bundle, then runs `astro build`)
6. **Upload** the `dist/` folder as a Pages artifact
7. **Deploy** the artifact to GitHub Pages

To deploy a fork to your own GitHub Pages:

1. Fork this repository.
2. Go to **Settings → Pages** and set the source to **GitHub Actions**.
3. Update `astro.config.mjs` — change `site` to your GitHub Pages URL and `base` to your repository name:
   ```js
   export default defineConfig({
     site: 'https://<your-username>.github.io',
     base: '/<your-repo-name>',
   });
   ```
4. Push to `main` — the workflow will build and deploy automatically.

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feature/my-new-diagram
   ```
2. Make your changes. New diagram pages go in `src/pages/`.
3. Run `npm run dev` and verify your changes in the browser.
4. Run `npm test` to verify tests pass.
5. Run `npm run build` to ensure the production build succeeds.
6. Open a **Pull Request** against `main` with a clear description of what you've added or changed.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a full history of notable changes.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
