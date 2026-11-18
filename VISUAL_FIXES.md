# Visual corrections

## Implemented

1. The design-project calculator now uses a compact horizontal layout with the area range, price and CTA inside a separate bordered card.
2. The home-page typewriter reserves a stable line box to prevent layout movement while phrases are typed and erased.
3. The old Three.js build scene is no longer mounted or loaded. The build section keeps its explanatory steps and shows a lightweight placeholder reserved for a future slider.
4. The "Прокрутите вниз" indicator is decorative, not a link, and includes the animated green vertical line.
5. The hero form is no longer wrapped in a visible card. The phone field and callback button use the transparent original treatment; the primary CTA has the original green/black treatment and desktop proportions.
6. Removed the invalid importmap script from the React component tree. This resolves the Next.js error caused by rendering a raw script tag inside a Client Component.
7. The detailed calculator link now lifts on hover and changes its arrow from green to orange.
8. The design-project calculator typography, spacing, slider and price presentation were aligned to the original layout.

## Fonts

The original font families are Inter for body text and Montserrat for headings and prominent controls. They are loaded through a runtime Google Fonts CSS import rather than `next/font/google`, so production builds do not require a network request to Google Fonts at build time.

## Verification

- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm run build` - passed.
- Local route smoke tests for `/`, `/calculator`, `/gallery`, `/privacy` and `/icon.svg` - HTTP 200.
- The rendered home page no longer contains the importmap script or a reference to the legacy 3D loader.
