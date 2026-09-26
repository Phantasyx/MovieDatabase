# Marquee

Marquee is a public movie-review shelf. It is an early PHP login project rebuilt as a static demo for [PhantasyX](https://phantasyx.com). The films and the reviews that ship with the shelf are samples. This is not client work.

Sign-in, reviews, and password changes stay in the browser. Nothing is emailed and nothing is sent to a server.

## Run locally

From this folder:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/). There is no build step.

### Demo accounts

| Name | Email | Password | Starts with |
| --- | --- | --- | --- |
| Mina Cole | mina@marquee.demo | demo-reviewer | an empty personal notebook |
| Sam Ortiz | sam@marquee.demo | demo-reader | an empty personal notebook |

Sample reviews already on the shelf are labeled **Sample review**. They are not accounts. A password change or a review you write is stored only in that browser. **Reset demo data** restores the sample shelf.

## Host it

The site is hash-routed (`#/film/f-tide`), so it can live at a domain root or in a subpath.

Copy this whole folder. Safe paths:

- `index.html`
- `css/`
- `js/`
- `favicon.svg`
- `robots.txt`
- `_headers` (Cloudflare Pages or Netlify; optional)
- `.nojekyll`
- `wrangler.jsonc` (Workers static assets; optional)
- `.github/workflows/pages.yml` (only if this folder is its own Git repository)

For phantasyx.com, publish the folder as a static directory such as `/examples/marquee/`.

### GitHub Pages

If this folder is the repository root, `.github/workflows/pages.yml` publishes it after GitHub Pages is set to **GitHub Actions**.

### Cloudflare Workers

From this folder, with Wrangler 4 and a logged-in Cloudflare account:

```bash
npx wrangler@4 deploy
```

`wrangler.jsonc` serves the folder as Workers static assets. No Worker script is required. Do not deploy unless you mean to publish it on your account.

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

Then set Pages to GitHub Actions, or deploy with Wrangler.
