#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_BASEURL="${SITE_BASEURL:-}"
DOCS_BASE_URL="${SITE_BASEURL%/}/docs/"

if [[ "$DOCS_BASE_URL" != /* ]]; then
  DOCS_BASE_URL="/$DOCS_BASE_URL"
fi

cd "$ROOT_DIR"

if ! command -v bundle >/dev/null 2>&1; then
  echo "error: Bundler is required (https://bundler.io/)" >&2
  exit 1
fi

if [[ ! -d docs/node_modules ]]; then
  echo "error: documentation dependencies are missing; run: npm ci --prefix docs" >&2
  exit 1
fi

bundle check >/dev/null || {
  echo "error: Ruby dependencies are missing; run: bundle install" >&2
  exit 1
}

rm -rf _site
bundle exec jekyll build --baseurl "$SITE_BASEURL" --destination "$ROOT_DIR/_site"
DOCS_BASE_URL="$DOCS_BASE_URL" npm run build --prefix docs

mkdir -p "$ROOT_DIR/_site/docs"
cp -a "$ROOT_DIR/docs/build/." "$ROOT_DIR/_site/docs/"

echo "Combined site built at $ROOT_DIR/_site/ (public base: ${SITE_BASEURL:-/})"
