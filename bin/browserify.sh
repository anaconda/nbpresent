#!/bin/bash
. bin/env.sh
#  ${EXTRA} \

browserify \
  --standalone nbpresent \
  --extension es6 \
  --external ./nbpresent-deps.min \
  --external ./nbpresent-loader.min \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.min.js \
  src/es6/index.es6

ls -lathr ${DIST}
