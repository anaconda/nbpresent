#!/bin/bash
. bin/env.sh
#  ${EXTRA} \

browserify \
  --standalone nbpresent-standalone \
  --extension es6 \
  --external jquery \
  --external nbpresent-deps \
  --external underscore \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.standalone.min.js \
  src/es6/mode/standalone.es6

ls -lathr ${DIST}
