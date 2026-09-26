# Marquee

Marquee is a movie catalog. You browse Movies, save favorites, write reviews, choose a plan, and open a profile after you sign in. Favorites, reviews, and billing stay in the browser. Checkout uses a sample card and nothing is charged. Photographs are from Unsplash. [PhantasyX](https://phantasyx.com).

Sample reviews on a title are labeled as samples.

The PHP tree (`*.php`, `lib/`, `post/`, `tests/`, `vendor/`) is the archived coursework this repository started from: a login-and-records desk. Database passwords are not stored in source. Marquee does not use that archive.

## Run Marquee locally

```bash
python3 -m http.server 8080 --directory marquee
```

Open [http://localhost:8080/](http://localhost:8080/). `sh marquee/build.sh` writes the publishable copy to `marquee/dist/`.

Accounts, also listed on the sign-in screen:

| Email | Password | Can do |
| --- | --- | --- |
| mina@marquee.demo | demo-reviewer | Write reviews and save favorites |
| sam@marquee.demo | demo-reader | Read reviews and save favorites |

## Build output

`sh marquee/build.sh` copies the catalog into `marquee/dist/`. That directory is the build output:

- `marquee/dist/index.html`
- `marquee/dist/css/marquee.css`
- `marquee/dist/js/data.js`
- `marquee/dist/js/store.js`
- `marquee/dist/js/app.js`
- `marquee/dist/favicon.svg`
- `marquee/dist/robots.txt`
- `marquee/dist/_headers`
- `marquee/dist/images/`

What was checked in the browser is in `marquee/E2E.md`.

## Hosting

The public host is **https://marquee.phantasyx.com**.

`marquee/wrangler.jsonc` is an assets-only Worker with a custom domain on that hostname. From `marquee/`, on the Cloudflare account that holds the `phantasyx.com` zone:

```bash
npx wrangler@4 whoami
npx wrangler@4 deploy
```

Deploy creates the DNS record and certificate. The hostname must not already have a CNAME. Full steps, including a different name such as `movies.phantasyx.com`, are in `marquee/README.md`.

A path such as `phantasyx.com/examples/marquee/` can serve the same files. Use it only when a subdomain cannot be added.

- **This repository, GitHub Pages:** `.github/workflows/pages.yml` publishes `marquee/` after Pages is set to GitHub Actions. That is a preview path. The phantasyx.com host is the subdomain above.
- **Its own repository:** see `marquee/README.md`. Creating `Phantasyx/marquee` needs a token that can create repositories. This checkout cannot.

## Archived PHP app

Pages are marked `noindex`. A database connection is opened only when all of these are set:

- `FELIS_DB_DSN`
- `FELIS_DB_USER`
- `FELIS_DB_PASSWORD`

Optional: `FELIS_DB_PREFIX` (default `felis_`), `FELIS_DB_NAME`, `FELIS_EMAIL`, `FELIS_ROOT`, `FELIS_TIMEZONE`. No schema is included. Marquee does not use them.
