#!/bin/bash
git branch -D gh-pages
git checkout -b gh-pages
ember build --environment production
git rm -rf app app-addon config lib public tests vendor-addon Brocfile bower.json package.json testem.json
mv dist/* .
rm -rf dist
git add .
git commit -m "Publishing to github pages"
