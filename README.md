# Marquee

Marquee is the public demo in this repository: a small movie-review shelf with demo sign-in. It is an early PHP login project rebuilt as a static site for [PhantasyX](https://phantasyx.com).

The films are sample titles. Sample reviews are labeled as samples. This is not client work, and it does not use production accounts.

The PHP tree (`*.php`, `lib/`, `post/`, `tests/`, `vendor/`) is the archived coursework that this repo started from: a login-and-records desk. Database passwords are not stored in source. That archive is not the portfolio demo.

## Run Marquee locally

```bash
python3 -m http.server 8080 --directory marquee
```

Open [http://localhost:8080/](http://localhost:8080/). There is no build step. Output to publish is the `marquee/` folder.

Demo accounts, also listed on the sign-in screen:

| Email | Password |
| --- | --- |
| mina@marquee.demo | demo-reviewer |
| sam@marquee.demo | demo-reader |

## Copy to phantasyx.com

Copy `marquee/` and publish it as a static directory (site root, or a path such as `/examples/marquee/`).

Safe to copy:

- `marquee/index.html`
- `marquee/css/`
- `marquee/js/`
- `marquee/favicon.svg`
- `marquee/robots.txt`
- `marquee/_headers`
- `marquee/.nojekyll`
- `marquee/wrangler.jsonc` if you deploy with Workers
- `marquee/.github/` only when that folder is its own repository

Do not publish the PHP archive as the marketing example.

## Hosting

- **This repository, GitHub Pages:** `.github/workflows/pages.yml` publishes `marquee/` after Pages is set to GitHub Actions. This environment cannot turn that setting on, so there is no live URL until then. The site will be `https://<user>.github.io/<repository>/`.
- **Its own repository:** see `marquee/README.md`. Creating `Phantasyx/marquee` needs a token that can create repositories. This checkout cannot.
- **Cloudflare Workers:** from `marquee/`, run `npx wrangler@4 deploy`. The config serves static assets only.

## Archived PHP app

Pages are marked `noindex`. A database connection is opened only when all of these are set:

- `FELIS_DB_DSN`
- `FELIS_DB_USER`
- `FELIS_DB_PASSWORD`

Optional: `FELIS_DB_PREFIX` (default `felis_`), `FELIS_DB_NAME`, `FELIS_EMAIL`, `FELIS_ROOT`, `FELIS_TIMEZONE`. No schema is included. Marquee does not use them.
