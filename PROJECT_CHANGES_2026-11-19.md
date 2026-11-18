# Project changes - 2026-11-19

## Home page and forms

- Preserved the first-visit-only full-screen brand intro.
- Kept repair package cards and calculator tabs synchronized through one selected ID.
- Kept the additional-services asymmetric grid and tuned card typography, spacing,
  icon dimensions and proportions.
- Standardized consent checkbox layout globally across all lead forms.
- Client and server both validate the personal-data consent checkbox.

## Calculator

- Added animated money display to the main total, mobile total bar and lead summary.
- Animation interpolates from the previous displayed amount to the new amount.
- Respects `prefers-reduced-motion`.
- Kept original MAX and Telegram SVG marks on the contact-channel buttons.

## Gallery

- Increased the gallery card arrow to a 36x36 circle, green with a dark arrow.
- Added a small horizontal hover movement and inverse hover colors.
- Styled the gallery note as a white dashed information strip with a green icon,
  compact spacing and rounded corners.

## Security and quality

- See `SECURITY_AND_QUALITY_AUDIT.md` for hardening, limitations and verification.
