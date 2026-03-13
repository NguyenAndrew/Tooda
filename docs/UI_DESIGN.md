# Tooda UI Design Document

## Overview

This document defines the visual design language, component patterns, and interaction guidelines for the Tooda web application. It serves as the single source of truth for all UI decisions across desktop and mobile viewports.

---

## Design Principles

1. **Clarity first** – Every visual element must serve a purpose. Diagrams and architecture content are the hero; chrome and decoration support, never distract.
2. **Responsive by default** – Layouts are designed mobile-first and tested across phones (360 px+), tablets (768 px+), and desktop (1024 px+).
3. **Accessible contrast** – Text and interactive elements meet WCAG 2.1 AA contrast ratios in both light and dark modes.
4. **Purposeful motion** – Animation draws attention to hierarchy (hero glow, floating badge) without causing motion sickness. All animations respect `prefers-reduced-motion`.
5. **Consistent feedback** – Interactive elements use the same hover, active, and focus patterns throughout the application.

---

## Color Palette

The palette uses **Teal → Cyan → Emerald** as the primary spectrum — a professional, technology-forward set of colours that is immediately distinguishable from the dark-purple aesthetic common in AI-generated UIs.

### Semantic Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--bg-color` | `#f8fafc` (slate-50) | `#0f172a` (slate-900) | Page background |
| `--grad1` | `rgba(20,184,166, 0.15)` (teal-500) | `rgba(20,184,166, 0.28)` | Primary radial gradient |
| `--grad2` | `rgba(6,182,212, 0.10)` (cyan-500) | `rgba(6,182,212, 0.18)` | Secondary radial gradient |
| `--grad3` | `rgba(16,185,129, 0.07)` (emerald-500) | `rgba(16,185,129, 0.14)` | Tertiary radial gradient |
| `--grid-line` | `rgba(20,184,166, 0.04)` | `rgba(20,184,166, 0.08)` | Background grid overlay |

### Tailwind Colour Classes

| Role | Light | Dark | Notes |
|---|---|---|---|
| **Primary action** | `teal-600` / `teal-500` | `teal-400` | Buttons, active states, focus rings |
| **Secondary action** | `cyan-600` / `cyan-500` | `cyan-400` | Renderer toggle active, secondary CTAs |
| **Tertiary accent** | `emerald-600` / `emerald-500` | `emerald-400` | Positive states, tertiary highlights |
| **Back/utility links** | `teal-600` | `teal-400` | Navigation back links |
| **Badge text** | `teal-700` | `teal-300` | Informational pill badges |
| **Neutral text** | `slate-900` | `slate-50` | Body copy |
| **Subdued text** | `slate-600` | `slate-400` | Captions, secondary descriptions |
| **Muted text** | `slate-500` | `slate-500` | Placeholder, hints |
| **Border default** | `slate-200/80` | `slate-700/60` | Card, panel borders |
| **Border interactive** | `teal-400/50` | `teal-500/50` | Hovered card borders |
| **Card surface** | `white/70` | `slate-800/60` | Feature cards |

### Gradient Definitions

```
Hero heading gradient:   from-teal-400 via-cyan-400 to-emerald-400
Primary CTA gradient:    from-teal-500 to-cyan-500
Active tab gradient:     from-teal-500 to-cyan-500
Renderer btn gradient:   from-cyan-500 to-teal-400
```

### Glow Animations

```css
/* Hero title glow (no purple) */
@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 16px rgba(20,184,166,0.5)); }  /* teal */
  50%       { filter: drop-shadow(0 0 36px rgba(6,182,212,0.8)); }  /* cyan */
}
```

---

## Typography

| Element | Size | Weight | Notes |
|---|---|---|---|
| Hero h1 (index) | `clamp(3.5rem, 10vw, 7rem)` | 800 | Gradient text, glow animation |
| Page h1 (inner pages) | `clamp(2rem, 6vw, 3.5rem)` | 800 | Gradient text, glow animation |
| Card heading | `1.125rem` (text-lg) | 700 | `slate-800` / `slate-100` |
| Body paragraph | `1rem` | 400 | `slate-600` / `slate-300` |
| Caption / secondary | `0.875rem` | 400 | `slate-500` / `slate-400` |
| Badge / label | `0.75rem` | 600 | Uppercase, tracked |
| Code | System monospace | 400 | `slate-600` / `slate-300` |

**Font family**: System sans-serif stack (`font-sans` in Tailwind).

---

## Spacing & Layout

### Page Grid
- Maximum content width: `max-w-5xl` (1024 px) on landing; `max-w-[900px]` on diagram panels.
- Horizontal padding: `px-4` (mobile) → `px-6` (tablet+).
- Top padding: `py-20` on landing hero; `pt-8` on inner page headers.

### Responsive Breakpoints
- `sm`: 640 px (2-column feature grid, inline nav controls)
- `lg`: 1024 px (3-column feature grid)

### Card Grid
```
mobile:   1 column
sm:       2 columns
lg:       3 columns (with col-span overrides for wide cards)
```

---

## Components

### Feature Card

```
Rounded: rounded-2xl
Border:  border border-slate-200/80 dark:border-slate-700/60
Background: bg-white/70 dark:bg-slate-800/60
Backdrop: backdrop-blur-sm
Hover (pointer devices only): -translate-y-1 border-teal-400/50 shadow-teal-500/10
Hover overlay: linear-gradient(135deg, rgba(20,184,166,0.07) 0%, transparent 60%)
```

### Primary CTA Button

```
Shape:      rounded-xl
Gradient:   bg-gradient-to-br from-teal-500 to-cyan-500
Text:       text-white font-semibold text-sm
Shadow:     shadow-lg shadow-teal-500/25
Hover:      -translate-y-0.5 shadow-xl shadow-teal-500/35
Active:     scale-95
```

### Tab / Example / Renderer Button

**Inactive state**
```
Border:     border-slate-300 dark:border-slate-700
Background: bg-slate-100 dark:bg-slate-800
Text:       text-slate-600 dark:text-slate-400
Hover:      bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-50
```

**Active state (tab/example)**
```
Gradient: from-teal-500 to-cyan-500, text-white
```

**Active state (renderer)**
```
Gradient: from-cyan-500 to-teal-400, text-white
```

### Theme Toggle Button

```
Shape:      rounded-full, h-10 w-10
Border:     border-slate-300 dark:border-slate-700
Background: bg-white/80 dark:bg-slate-800/80
Hover:      border-teal-400 dark:border-teal-500/50
Position:   fixed right-4 top-4 z-50
```

### Back / Utility Link

```
Color: text-teal-600 dark:text-teal-400
Hover: underline
```

### Badge (Floating Pill)

```
Border:     border-teal-500/40
Background: bg-teal-500/10
Text:       text-teal-700 dark:text-teal-300
Font:       text-xs font-semibold uppercase tracking-widest
Shape:      rounded-full
```

### Progress Dot (Slideshow)

```
Default: h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600
Active:  w-5 bg-teal-500
```

### Slide Navigation Bar

```
Border:     border-t border-slate-200/80 dark:border-slate-700/60
Background: bg-white/90 dark:bg-slate-900/90
Backdrop:   backdrop-blur-md
Nav button hover: border-teal-400/50 dark:border-teal-500/50
```

---

## Background System

Every page shares the same animated radial gradient + grid background system:

```css
body {
  background-color: var(--bg-color);
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -10%, var(--grad1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 90% 80%,  var(--grad2) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 10% 90%,  var(--grad3) 0%, transparent 60%);
}

/* Subtle grid overlay */
body::before {
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 60px 60px;
}
```

---

## Accessibility

- All interactive elements have `:focus-visible` outlines (browser default).
- `aria-label` is set on the theme toggle button and updated on click.
- Hover-only transforms are gated behind `@media (hover: hover)` so iOS Safari's sticky-hover behaviour never mispositions elements during scroll.
- Colour contrast: all text/background pairs ≥ 4.5:1 (AA).
- `touch-action: manipulation` on slideshow navigation buttons eliminates the 300 ms tap delay on mobile browsers.
- `viewport-fit=cover` with `env(safe-area-inset-*)` on the slideshow page for iPhone home-bar clearance.

---

## Mobile Considerations

- Buttons and interactive targets are at least 44 × 44 CSS px.
- Feature card grid collapses to single column on narrow viewports.
- Tab bars use `flex-wrap` to reflow onto multiple rows rather than clipping.
- Slideshow: a compact landscape mode hides the back link and reduces padding when `orientation: landscape` and `max-height ≤ 500 px`.
- Hero type uses `clamp()` to scale smoothly across viewports.

---

## Dark Mode

Dark mode is toggled via a `dark` class on `<html>` and persisted in `localStorage` under the key `theme`. An inline script applies the stored preference before first paint to avoid a flash of unstyled content.

Dark is the default when no preference is stored — matching developer-tool convention. Explicitly storing `'light'` in `localStorage` always takes precedence.

---

## What Was Changed From Previous Design

| Aspect | Before | After |
|---|---|---|
| Primary hue | Indigo (`#6366f1`) | Teal (`#14b8a6`) |
| Secondary hue | Violet / Dark Purple (`#8b5cf6`) | Cyan (`#06b6d4`) |
| Tertiary hue | Sky (`#38bdf8`) | Emerald (`#10b981`) |
| Gradient bg | Indigo → Violet → Sky glows | Teal → Cyan → Emerald glows |
| Grid line | `rgba(99,102,241,...)` | `rgba(20,184,166,...)` |
| Hero glow | Purple drop-shadow | Teal/Cyan drop-shadow |
| CTA button | Indigo → Violet | Teal → Cyan |
| Active tab | Indigo → Violet | Teal → Cyan |
| Back links | `violet-600/400` | `teal-600/400` |
| Badge accent | `indigo-500/400` | `teal-500/400` |
| Progress dot | `indigo-500` | `teal-500` |
| Nav btn hover | `indigo-400/500` border | `teal-400/500` border |
