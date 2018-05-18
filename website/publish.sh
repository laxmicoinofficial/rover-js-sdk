#!/bin/bash

set -e

cd ../../js-rover-lib-gh-pages
git checkout -- .
git clean -dfx
git fetch
git rebase
rm -Rf *
cd ../js-rover-lib/website
npm run-script docs
cp -R docs/* ../../js-rover-lib-gh-pages/
rm -Rf docs/
cd ../../js-rover-lib-gh-pages
git add --all
git commit -m "update website"
git push
cd ../js-rover-lib/website