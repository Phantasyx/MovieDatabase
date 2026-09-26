# Marquee

Marquee is a film shelf you browse like a streaming home page. It is an early PHP login project rebuilt as a portfolio demo for [PhantasyX](https://phantasyx.com). The titles are invented. Sample notes are labeled so they are not mistaken for yours. This is not client work.

Sign-in, notes, and password changes stay in the browser. Nothing is emailed and nothing is sent to a server.

The public address is [https://marquee.phantasyx.com](https://marquee.phantasyx.com).

## Run locally

From this folder:

```bash
sh build.sh
python3 -m http.server 8080 --directory dist
```

Open [http://localhost:8080/](http://localhost:8080/). `dist/` is the same shelf Wrangler publishes.

### Demo accounts

| Name | Email | Password | What the account can do |
| --- | --- | --- | --- |
| Mina Cole | mina@marquee.demo | demo-reviewer | Leave notes on titles |
| Sam Ortiz | sam@marquee.demo | demo-reader | Read the shelf |

Sample notes already on a title are labeled **Sample note**. They are not accounts. A password change or a note you write is stored only in that browser. **Reset demo data** restores the sample shelf.

## Photographs

Every title uses a photograph from [Unsplash](https://unsplash.com). The [Unsplash License](https://unsplash.com/license) allows this use and does not require attribution. The shelf still lists a source link for each picture under Photograph credits. The files live in `images/` and are copied into `dist/images/` by the build. They are not generated images.

What was exercised in the browser is written in [E2E.md](E2E.md).

## Build output

```bash
sh build.sh
```

That writes `dist/`:

- `dist/index.html`
- `dist/css/marquee.css`
- `dist/js/data.js`
- `dist/js/store.js`
- `dist/js/app.js`
- `dist/favicon.svg`
- `dist/robots.txt`
- `dist/_headers`
- `dist/images/`

`wrangler.jsonc` publishes `dist/`. Notes in this folder stay out of the upload.

## Host on marquee.phantasyx.com

The shelf is hash-routed (`#/film/f-tide`), so the hostname root is the right place for it. `wrangler.jsonc` attaches the Worker to `marquee.phantasyx.com` as a Cloudflare custom domain. Deploy creates the DNS record and the certificate. The zone has to be on the same Cloudflare account, and that hostname cannot already have a CNAME.

From this folder, with Wrangler 4, after `sh build.sh`:

```bash
npx wrangler@4 whoami
npx wrangler@4 deploy
```

Then open [https://marquee.phantasyx.com](https://marquee.phantasyx.com). `workers.dev` stays enabled as a preview hostname from the same deploy.

To use a different name, such as `movies.phantasyx.com`, change `pattern` in `wrangler.jsonc` and deploy again.

If `phantasyx.com` is not on the account you deploy from, remove the `routes` array, deploy, and add the custom domain later under Workers & Pages → the `marquee` Worker → Settings → Domains & Routes → Add → Custom domain. A folder on the main site, such as `phantasyx.com/examples/marquee/`, also serves this build because the links are relative. Use that only when a subdomain cannot be added.

### GitHub Pages

If this folder is the repository root, `.github/workflows/pages.yml` publishes it after GitHub Pages is set to **GitHub Actions**. The Cloudflare subdomain above is the host to use for phantasyx.com.

### Its own GitHub repository

This checkout could not create a repository under the Phantasyx organization. To publish Marquee on its own:

```bash
mkdir marquee-site && cp -a . marquee-site/
cd marquee-site
rm -rf .git
git init -b main
git add .
git commit -m "Publish the Marquee public demo"
gh repo create Phantasyx/marquee --public --source=. --remote=origin --push
```

Then deploy with Wrangler as above.
