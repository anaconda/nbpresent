#!/bin/bash
. bin/env.sh
#  ${EXTRA} \

browserify \
  --standalone nbpresent-runtime \
  --extension es6 \
  --external jquery \
  --external nbpresent-deps \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.runtime.min.js \
  src/es6/runtime.es6

ls -lathr ${DIST}
