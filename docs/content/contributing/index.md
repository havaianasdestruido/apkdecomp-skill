---
id: index
title: Contributing
sidebar_position: 1
slug: /contributing/
description: Improve APKDecomp instructions, references, and website while keeping changes scoped and testable.
---

# Contributing

Contributions are welcome across skill behavior, technical references, documentation, accessibility, and build tooling.

## Choose the right source

| Change | Edit |
|---|---|
| activation terms, core workflow, safety boundary | `SKILL.md` |
| concise operational guidance loaded by the skill | `references/*.md` |
| long-form tutorials and human-facing explanations | `docs/content/**/*.md` |
| documentation navigation/configuration | `docs/sidebars.js`, `docs/docusaurus.config.js` |
| landing page content | `index.html` |
| landing page appearance/behavior | `assets/css/main.css`, `assets/js/main.js` |
| shared Jekyll metadata/layout | `_config.yml`, `_layouts/default.html` |
| combined build/deployment | `scripts/build-site.sh`, `.github/workflows/site.yml` |

When a technical workflow changes, update both the concise runtime reference and the related public guide. They have different audiences but should not contradict each other.

## Contribution principles

- Keep authorization and controlled-lab assumptions explicit.
- Prefer evidence-led decisions over declaring one tool universally best.
- State version-sensitive behavior cautiously.
- Separate observed facts from interpretation.
- Preserve original artifacts before suggesting transformation.
- Link to primary upstream projects when naming a tool.
- Do not add proprietary binaries, APKs, mappings, dumps, keys, or credentials.

## Local checks

Install dependencies once:

```bash
bundle install
npm ci --prefix docs
```

Build the integrated site:

```bash
./scripts/build-site.sh
python3 -m http.server 4000 --directory _site
```

The build is strict: broken Docusaurus links and anchors fail CI. Also inspect:

- landing page at `http://localhost:4000/`;
- docs at `http://localhost:4000/docs/`;
- keyboard navigation and visible focus;
- mobile layouts;
- light and dark documentation themes;
- browser console/network errors;
- content with JavaScript disabled where practical.

## Pull-request checklist

- [ ] The change has one clear purpose.
- [ ] New commands are syntactically valid and do not imply authorization.
- [ ] Version-sensitive claims include context.
- [ ] Relevant runtime and public docs agree.
- [ ] No generated `_site/`, `docs/build/`, dependency folders, or target artifacts are committed.
- [ ] `./scripts/build-site.sh` succeeds.
- [ ] New/renamed docs appear in `sidebars.js` or are intentionally unlisted.
- [ ] Links resolve under both local `/docs/` and deployed project paths.
- [ ] Screens and controls remain keyboard accessible.

## Reporting technical errors safely

A useful issue names the page/file, quotes the inaccurate statement, explains the target/tool version, and links to public evidence. Do not attach third-party app packages or private assessment output.

For deeper guidance, read [Authoring the skill](./skill-authoring.md) and [Website development](./website.md).
