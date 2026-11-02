# Project architecture
- Blog archival patterns and permanent redirect priorities live in a browser-safe shared module used by the blog loader and generation scripts, so old URLs and future generation use identical rules.
- Only `src/content/blog/generated/*.json` is globbed for published blog content; archived JSON is retained outside this glob to exclude it from listings, related articles, sitemap, and submissions.
- Catalog starting rates and MacBook rates are shared with editorial generation through a route-independent data module, so scripts never import a page and prices remain aligned.