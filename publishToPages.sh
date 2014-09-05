#!/bin/bash
git branch -D gh-pages
git push origin --delete gh-pages
git checkout -b gh-pages
ember build --environment production
git rm -rf app app-addon config lib public tests vendor-addon
git rm -rf Brocfile.js bower.json package.json testem.json
mv dist/* .
rm -rf dist
git add .
git commit -m "Publishing to github pages"
git push origin gh-pages
git checkout master
