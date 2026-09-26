#!/bin/sh
# Copy the static site into dist/. That directory is the publishable build.
set -eu
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist/css dist/js dist/images
cp index.html favicon.svg robots.txt _headers .nojekyll dist/
cp css/marquee.css dist/css/
cp js/data.js js/store.js js/app.js dist/js/
cp images/*.jpg dist/images/
