# Felis Investigations

Felis Investigations is a small case desk for discreet inquiries: staff open files, write notes and surveillance reports, and clients see only their own cases. This repository started as a 2017 PHP class project. The portfolio version is a static demo that can be copied onto a marketing site.

The showcase does not need PHP, MySQL, or a build step. Demo accounts and case files live in the browser. Nothing is emailed, and nothing is sent to a server.

## Run the demo locally

From the repository root:

```bash
python3 -m http.server 8080 --directory demo
```

Open [http://localhost:8080/](http://localhost:8080/).

There is no compile step. `demo/` is the site to publish.

### Demo accounts

These passwords are public and exist only in the static demo.

| Role | Email | Password |
| --- | --- | --- |
| Admin | avery@felis.demo | demo-admin |
| Staff | harvey@felis.demo | demo-staff |
| Client | levon@felis.demo | demo-client |
| Client | mary@felis.demo | demo-client |

Accounts created inside the demo get the password `demo-new-user`. Resetting a password updates it in that browser only. Use **Reset demo data** in the footer to restore the seed.

## Copy to phantasyx.com

Copy the `demo/` folder as a static site (site root, or a subpath such as `/examples/felis/`). Hash routes (`#/cases`, `#/login`) work without server rewrites.

Safe to copy:

- `demo/index.html`
- `demo/css/`
- `demo/js/`
- `demo/favicon.svg`
- `demo/robots.txt`
- `demo/_headers` (Cloudflare Pages / Netlify response headers; optional)
- `demo/.nojekyll` (keeps GitHub Pages from running Jekyll)

Do not publish the legacy PHP tree (`*.php`, `lib/`, `post/`, `tests/`, `vendor/`) as the marketing example. It expects a private database and is kept as the original app.

`demo/_headers` sets `X-Frame-Options: SAMEORIGIN`. A page on the same host can frame the demo. Remove that file if the host already sets headers.

## GitHub Pages

`.github/workflows/pages.yml` publishes `demo/` with GitHub Actions after it is on `master`. In the repository settings, set Pages to **GitHub Actions**. This checkout does not turn Pages on, so there is no live demo URL until that setting is saved. The site will be:

`https://<user>.github.io/<repository>/`

## Legacy PHP app

The original pages remain for reference. They are marked `noindex`. Database settings are environment variables, not values checked into the repo:

- `FELIS_DB_DSN` (example: `mysql:host=127.0.0.1;dbname=felis`)
- `FELIS_DB_USER`
- `FELIS_DB_PASSWORD`
- `FELIS_DB_PREFIX` (default `felis_`)
- `FELIS_DB_NAME` (PHPUnit connection name, default `felis`)
- `FELIS_EMAIL`
- `FELIS_ROOT` (URL path prefix, empty for a local server)
- `FELIS_TIMEZONE` (default `America/Detroit`)

A schema is not included. The supported way to show the product is the static demo.
