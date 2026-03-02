# Tooda

> **Too**l for **d**i**a**grams — a lightweight, browser-based tool for creating and maintaining architecture and design diagrams using the [C4 model](https://c4model.com/) and [Mermaid](https://mermaid.js.org/).

[![Deploy to GitHub Pages](https://github.com/NguyenAndrew/Tooda/actions/workflows/deploy.yml/badge.svg)](https://github.com/NguyenAndrew/Tooda/actions/workflows/deploy.yml)

🌐 **Live site:** <https://nguyenandrew.github.io/Tooda>

---

## Table of Contents

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
  - [C4 Model Diagrams](#c4-model-diagrams)
  - [Class Diagrams](#class-diagrams)
- [Copilot Coding Agent](#copilot-coding-agent)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Tooda makes it easy to **visualize software architecture** directly in the browser — no desktop app or proprietary format required. Diagrams are written as plain text using Mermaid's diagram syntax and rendered on the fly, so they live alongside your code and can be version-controlled like any other file.

The current showcase is a complete **Online Banking System** illustrated across all four levels of the [C4 model](https://c4model.com/), giving you a ready-to-adapt template for your own projects.

---

## Features

- 📐 **C4 model support** — Context, Container, Component, and Code (class) diagrams out of the box
- 🧜 **Mermaid rendering** — diagrams are defined as text and rendered in the browser; no image assets to manage
- 🗂️ **Tabbed diagram viewer** — switch between C4 levels with a single click; the active tab is bookmarkable via URL hash
- 🌑 **Dark-themed UI** — comfortable for long design sessions
- ⚡ **Static site** — built with [Astro](https://astro.build/), meaning zero client-side JavaScript framework overhead; extremely fast to load and easy to host
- 🚀 **Automatic deployment** — GitHub Actions pipeline builds and deploys to GitHub Pages on every push to `main`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Site framework | [Astro](https://astro.build/) v5 |
| Diagram engine | [Mermaid](https://mermaid.js.org/) v11 |
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

Opens a local dev server at `http://localhost:4321/Tooda` with hot-module replacement. Changes to `.astro` files are reflected instantly in the browser.

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
│   └── copy-mermaid.js         # Pre-build helper: copies Mermaid bundle to public/
├── src/
│   └── pages/
│       ├── index.astro          # Landing page
│       └── c4.astro             # C4 diagram viewer (all 4 levels)
├── astro.config.mjs             # Astro configuration (site URL, base path)
├── package.json
├── package-lock.json
└── tsconfig.json                # TypeScript config (extends astro/tsconfigs/strict)
```

---

## Pages & Routes

| Route | File | Description |
|---|---|---|
| `/Tooda/` | `src/pages/index.astro` | Landing page with a brief intro and link to the diagram viewer |
| `/Tooda/c4` | `src/pages/c4.astro` | Interactive C4 diagram viewer with tabbed navigation |

> **Note:** The `/Tooda` base path is set in `astro.config.mjs` to match the GitHub Pages repository sub-path.

---

## Diagram Types

### C4 Model Diagrams

The C4 model provides a hierarchical way to describe software architecture using four levels of abstraction:

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

---

## Copilot Coding Agent

This repository is configured to work with [GitHub Copilot coding agent](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent). The `.github/workflows/copilot-setup-steps.yml` file pre-installs Node.js and npm dependencies before the agent starts work.

### Disabling the built-in Playwright MCP server

By default, Copilot coding agent starts **two** MCP servers automatically: GitHub and Playwright. To keep only the GitHub MCP server (and remove Playwright), paste the following JSON into **Repository Settings → Copilot → Coding agent → MCP configuration**:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "tools": [
        "actions_get",
        "actions_list",
        "get_code_scanning_alert",
        "get_commit",
        "get_file_contents",
        "get_job_logs",
        "get_label",
        "get_latest_release",
        "get_me",
        "get_release_by_tag",
        "get_secret_scanning_alert",
        "get_tag",
        "issue_read",
        "list_branches",
        "list_code_scanning_alerts",
        "list_commits",
        "list_issue_types",
        "list_issues",
        "list_pull_requests",
        "list_releases",
        "list_secret_scanning_alerts",
        "list_tags",
        "pull_request_read",
        "search_code",
        "search_issues",
        "search_pull_requests",
        "search_repositories",
        "search_users"
      ]
    }
  }
}
```

Specifying only the `github` entry here (with the required `tools` allow-list) tells the coding agent exactly which MCP servers and tools to use, which excludes the default Playwright server.

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
4. Run `npm run build` to ensure the production build succeeds.
5. Open a **Pull Request** against `main` with a clear description of what you've added or changed.

---

## License

This project does not currently include a license file. Please open an issue or pull request if you'd like to discuss licensing terms.
