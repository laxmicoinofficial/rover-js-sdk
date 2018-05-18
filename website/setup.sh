#!/bin/bash

cd ../../
if [ "$TRAVIS" ]; then
  git clone "https://stellar-jenkins@github.com/stellar/js-stellar-lib.git" js-rover-lib-gh-pages
else
  git clone git@github.com:rover/js-rover-lib.git js-rover-lib-gh-pages
fi
cd js-rover-lib-gh-pages
git checkout origin/gh-pages
git checkout -b gh-pages
git branch --set-upstream-to=origin/gh-pages
cd ../js-rover-lib/website
