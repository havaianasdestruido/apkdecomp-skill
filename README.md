# APKDecomp Skill

A reusable agent skill for planning and explaining **authorized Android package analysis**. It helps an agent fingerprint an APK (or AAB/APKS/XAPK), select an appropriate toolchain, inspect resources and bytecode, and recognize when the useful logic lives in native or managed-framework artifacts instead of DEX.

> This project is for software you own, are authorized to test, or are studying in a controlled research environment. It is not intended for piracy, DRM bypass, or unauthorized tampering.

## What is in this repository?

- [`SKILL.md`](SKILL.md) — trigger metadata, safety boundaries, and the primary analysis workflow.
- [`references/`](references/) — concise operational references loaded by the skill when needed.
- [`docs/`](docs/) — the Docusaurus documentation application and long-form guides.
- [`index.html`](index.html) and [`assets/`](assets/) — the Jekyll-powered project landing page.
- [`.github/workflows/site.yml`](.github/workflows/site.yml) — builds both static sites into one GitHub Pages artifact.

## Use the skill

Keep the directory structure intact so the relative links in `SKILL.md` continue to resolve. For a skills-compatible agent, clone the repository into that agent's skills directory (consult the agent's documentation for its exact path):

```bash
git clone https://github.com/havaianasdestruido/apkdecomp-skill.git apk-reverse-engineering
```

Then ask the agent to inspect an Android package you are authorized to analyze. The skill provides guidance; analysis tools such as `apktool`, `jadx`, and `apkid` are installed separately.

## Develop the website

The public site deliberately uses two generators:

- **Jekyll** owns the landing page at `/apkdecomp-skill/`.
- **Docusaurus** owns all documentation under `/apkdecomp-skill/docs/`.

### Requirements

- Ruby 3.3+
- Bundler
- Node.js 20+
- npm

```bash
bundle install
npm ci --prefix docs

# Build the combined site at _site/ for localhost
./scripts/build-site.sh
python3 -m http.server 4000 --directory _site
```

Open <http://localhost:4000/>. The deployment workflow sets `SITE_BASEURL=/apkdecomp-skill` so generated links include the GitHub Pages project prefix; leave it empty with a plain local file server.

For Docusaurus-only authoring with hot reload:

```bash
npm run start --prefix docs
# open http://localhost:3000/docs/
```

See the [website contributor guide](docs/content/contributing/website.md) for the build contract and deployment details.

## License

[MIT](LICENSE) © 2026 PatoFlamejanteTV (aka. UltimateQuack, havaianasdestruido)
