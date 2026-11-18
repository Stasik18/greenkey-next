# Home page corrections - 2026-11-19

## 1. Intro preloader

- The full-screen brand intro is shown only on the first visit in the browser.
- `localStorage` key: `greenkey-home-intro-seen`.
- Returning visits skip the intro immediately.
- If browser storage is unavailable, the page is not blocked by the intro.

## 2. Repair package selection

- Repair packages now have explicit stable IDs: `a`, `b`, `c`.
- The package cards and calculator tabs share one selected ID.
- Selecting a package card updates the matching calculator tab and price.
- Selecting a calculator tab updates the corresponding package card.
- Cards are actual buttons with `aria-pressed` and keyboard focus styles.

## 3. Additional services layout

- Rebuilt the desktop grid as a four-column bento layout:
  - cadastral works: 2 columns
  - engineering: 1 column
  - design: 1 column
  - design projects: 1 column
  - home staging: 1 column
  - management company: 2 columns
- Tablet uses two columns; mobile uses one.

## Validation

- `npm run typecheck` passed.
- `npm run lint` passed.
- Production build passed with `next build --webpack`.
