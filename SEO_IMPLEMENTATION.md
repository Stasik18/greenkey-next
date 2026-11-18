# SEO implementation

Date: 2026-11-19

## Technical SEO

- Russian document language: `lang="ru"`.
- Global title template and description are configured in `app/layout.tsx`.
- Route-specific title, description and canonical URL are configured for `/`,
  `/calculator`, `/gallery` and `/privacy`.
- Open Graph and Twitter card metadata are configured for the home page, calculator
  and gallery.
- Structured data:
  - Home page: `GeneralContractor` organization/service profile.
  - Calculator and gallery: `BreadcrumbList`.
- `app/robots.ts` generates `/robots.txt`, allows public pages and disallows `/api/`.
- `app/sitemap.ts` generates `/sitemap.xml` with the indexable landing pages.
- Privacy policy remains accessible to users but is `noindex, follow` and is excluded
  from the XML sitemap.
- `app/icon.svg` provides the application icon.
- Legacy `.html` routes redirect to their Next.js routes.

## Sitemap URLs

- https://sk-greenkey.ru/
- https://sk-greenkey.ru/calculator
- https://sk-greenkey.ru/gallery

## Before production launch

1. Confirm `https://sk-greenkey.ru` is the final canonical domain and DNS points to
   the new deployment.
2. Verify the deployed `robots.txt`, `sitemap.xml`, canonical tags and Open Graph image
   URLs from the public internet.
3. Add the domain to Google Search Console and Yandex Webmaster.
4. Submit the sitemap in both webmaster tools.
5. Check indexing, redirects, mobile usability and structured-data validation after
   the deployment is live.
6. Ensure every public image used by Open Graph returns HTTP 200 and has an appropriate
   social preview crop.

SEO metadata does not guarantee indexing or rankings; those depend on the live site,
content, crawlability and search engine evaluation.
