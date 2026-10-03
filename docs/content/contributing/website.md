---
id: website
title: Website development
sidebar_position: 3
description: Develop, build, test, and deploy the hybrid Jekyll landing page and Docusaurus documentation site.
---

# Website development

The public site combines two static generators in one deployment artifact:

- **Jekyll** owns the product landing page and shared top-level assets.
- **Docusaurus** owns everything under `/docs/`.

This boundary is intentional. Do not implement a Docusaurus home route at the project root or let Jekyll process documentation content.

## Requirements

- Ruby 3.3 or newer
- Bundler
- Node.js 20 or newer
- npm

Install dependencies:

```bash
bundle install
npm ci --prefix docs
```

Ruby dependencies are pinned by `Gemfile.lock`; Node dependencies are pinned by `docs/package-lock.json`.

## Run Docusaurus while writing

```bash
npm run start --prefix docs
```

The default Docusaurus base URL is `/docs/`, so open:

```text
http://localhost:3000/docs/
```

Hot reload covers documentation, sidebar, config, and CSS changes. The local-search plugin creates its complete index during a production build, so test search after `build`/`serve`.

## Build the combined site

```bash
./scripts/build-site.sh
python3 -m http.server 4000 --directory _site
```

Open:

- `http://localhost:4000/` for Jekyll;
- `http://localhost:4000/docs/` for Docusaurus.

The script:

1. verifies Ruby and Node dependencies;
2. cleans `_site/`;
3. builds Jekyll with the selected base URL;
4. builds Docusaurus with a matching docs base URL;
5. copies `docs/build/` into `_site/docs/`.

Generated directories are ignored by Git.

## Base URL rules

Two path concepts must remain aligned:

| Build | Jekyll base | Docusaurus base |
|---|---|---|
| local combined | empty | `/docs/` |
| GitHub project Pages | `/apkdecomp-skill` | `/apkdecomp-skill/docs/` |

The build script derives the docs base from `SITE_BASEURL`:

```bash
SITE_BASEURL=/apkdecomp-skill ./scripts/build-site.sh
```

Docusaurus's docs plugin uses `routeBasePath: '/'` **inside** its own site. Do not change it to `/docs`; the site base already supplies that segment.

Use Jekyll's `relative_url` or `absolute_url` filters in landing templates instead of hardcoding the project prefix.

## Add a documentation page

1. Create a Markdown/MDX file under `docs/content/`.
2. Give it a stable `id`, title, description, and sidebar position.
3. Add the ID to `docs/sidebars.js` in the appropriate category.
4. Link with relative Markdown paths where possible.
5. Run a production build; broken links and anchors are configured to fail.

Example front matter:

```yaml
---
id: example
title: Example page
sidebar_position: 4
description: A concise summary for search and social metadata.
---
```

Avoid changing IDs casually; they determine URLs and can break external links.

## Edit the landing page

- Content and sections: `index.html`
- Page shell and metadata: `_layouts/default.html`
- Design tokens/responsive layout: `assets/css/main.css`
- Mobile navigation, copy action, and reveals: `assets/js/main.js`
- Marks/social artwork: `assets/img/`

The landing page should remain functional without JavaScript. JavaScript only enhances menu behavior, copy feedback, and reveal animation.

## Test before opening a pull request

### Automated build

```bash
./scripts/build-site.sh
```

This catches Jekyll errors, invalid Docusaurus config, MDX errors, broken documentation links, and many route mistakes.

### Manual review

- Check 320 px, tablet, and desktop widths.
- Navigate using only keyboard.
- Verify focus indicators and skip links.
- Test Docusaurus light/dark themes.
- Check `/docs/` search in a production build.
- Inspect the 404 page.
- Disable motion in the OS/browser and confirm animations are suppressed.
- Inspect generated links for an accidental `/docs/docs/` or missing project prefix.

## Deployment

`.github/workflows/site.yml` runs for pull requests and `main`:

- pull requests perform a strict build;
- `main` builds with `SITE_BASEURL=/<repository-name>`;
- the combined `_site/` directory is uploaded as one Pages artifact;
- `actions/deploy-pages` publishes that artifact.

The repository's GitHub Pages source must be **GitHub Actions**, not “Deploy from a branch.”

A custom domain requires coordinated changes to Jekyll `url`/`baseurl`, Docusaurus `url`/`baseUrl`, workflow environment, and usually a `CNAME`. Do not change only one generator.

## Dependency updates

Update Docusaurus packages together at compatible versions, then rebuild:

```bash
npm install --prefix docs \
  @docusaurus/core@latest \
  @docusaurus/preset-classic@latest \
  @docusaurus/theme-mermaid@latest
npm run build --prefix docs
```

Review release notes for Node requirements and config deprecations. Commit lockfile changes with the source change; do not hand-edit `package-lock.json`.
