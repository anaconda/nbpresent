#!/bin/bash
. bin/env.sh

browserify \
  --extension es6 \
  --external base/js/namespace \
  --outfile ${DIST}/nbpresent.min.js \
  --standalone nbpresent \
  --transform [ babelify --sourceMapRelative . ] \
  --transform uglifyify \
  --debug \
  src/es6/index.es6
