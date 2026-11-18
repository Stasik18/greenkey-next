# Performance audit

Date: 2026-11-19

## Scope and method

This is a production-build audit of the migrated project, not a Google PageSpeed Insights
report for a deployed public URL. The application was built in production mode and the
routes were requested from the local production server. Static asset sizes were measured
from the generated build.

A Lighthouse/PageSpeed score and browser Core Web Vitals (FCP, LCP, CLS, INP) are not
reported as numeric values: the target build is not deployed to a public URL, and the
isolated browser environment blocked navigation to the local test server. Inventing
those values would be a rather useless form of optimization.

## Production route smoke test

| Route          | HTTP | HTML / response size |
| -------------- | ---: | -------------------: |
| `/`            |  200 |        182,986 bytes |
| `/calculator`  |  200 |         49,718 bytes |
| `/gallery`     |  200 |         34,616 bytes |
| `/privacy`     |  200 |         58,344 bytes |
| `/robots.txt`  |  200 |             84 bytes |
| `/sitemap.xml` |  200 |            442 bytes |

All page routes above are statically prerendered. `/api/send-lead` is dynamic.

## Build payload inventory

- `public/`: 23.22 MiB, 263 files.
- `.next/static/`: 1.07 MiB, 33 generated JS/CSS files.
- Largest generated JS chunk: 241,744 bytes (about 236 KiB).
- Largest generated CSS file: 24,121 bytes (about 23.6 KiB).
- Desktop hero video: 4,446,441 bytes (about 4.24 MiB), H.264, 1280x720, 8 seconds.
- Mobile hero video: 334,954 bytes (about 327 KiB), H.264, 640x360, 8 seconds.
- Largest WebP image found: about 318 KiB.

These are on-disk sizes, not compressed transfer sizes. Shared chunks are cached and
modern HTTP compression changes the actual bytes transferred.

## Findings and priorities

### P1 - Desktop hero video is the largest performance opportunity

The desktop background video is about 4.24 MiB. The mobile alternative is only about
327 KiB. The mobile asset is already substantially lighter. For the desktop version,
test a visually reviewed H.264 encode with no audio track and a lower target bitrate
(or CRF-based encode). Compare the result at the actual rendered hero size before
replacing the original. Do not simply lower quality blindly.

### P2 - Keep image delivery responsive

The project uses WebP assets and `next/image` for key page imagery. Preserve explicit
`sizes` on responsive images and avoid eager-loading below-the-fold gallery imagery.
The gallery contains many photos, so lazy loading and correctly sized thumbnails matter.

### P2 - Keep Three.js out of the initial route payload

The current home build section uses a lightweight static placeholder. The original
Three.js vendor files remain in `public/assets/vendor/` for reference, but should not
be reintroduced into the initial page bundle unless the interactive 3D experience is
actually required.

### P3 - Fonts

Fonts are currently requested from Google Fonts through a CSS import. This avoids a
build-time dependency on Google Fonts, but creates a third-party runtime request.
For the strongest repeatable performance, self-host the exact Inter and Montserrat
weights used by the design and preload only the weights needed above the fold.

## Core Web Vitals / PageSpeed

To obtain real PageSpeed scores, deploy this exact production build to the canonical
HTTPS domain (or a public staging URL), then run Google PageSpeed Insights for both
mobile and desktop. The report should record Performance, Accessibility, Best
Practices, SEO, LCP, INP, CLS, FCP and TTFB. A PageSpeed run against the old live site
would not measure this migrated code.

Official tool: https://pagespeed.web.dev/

## Current assessment

- Build output is compact relative to the 23.22 MiB source asset library.
- Main route HTML is about 179 KiB before transfer compression.
- The desktop hero video is the clearest optimization target.
- No numeric Lighthouse score is claimed until the migrated build is publicly reachable.
