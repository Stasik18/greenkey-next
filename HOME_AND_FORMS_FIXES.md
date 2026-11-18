# Home layout and consent controls

## Task 1 - Services cards

- Kept the original asymmetric 2-1-1 / 1-1-2 desktop composition.
- Reduced card heading/body typography to the compact source proportions.
- Normalized icon dimensions, card padding, gaps and minimum row height.
- Tablet and mobile layouts remain 2-column / 1-column.

## Task 2 - Consent checkbox across the project

- Added one global `.form-consent-check` layout in `src/app/globals.css`.
- Standardized checkbox dimensions, top alignment, label line-height, text wrapping,
  privacy-link underline, focus-visible outline, and vertical spacing.
- The global class applies to home forms, home modal forms, vacancy form,
  calculator lead form, and gallery callback modal.

## Backend

- Lead endpoint remains intentionally disabled (HTTP 503), matching the source
  PHP handler's disabled state. No backend/SMTP behavior was changed.
