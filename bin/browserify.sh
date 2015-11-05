#!/bin/bash
. bin/env.sh

browserify \
  --extension es6 \
  --external bootstraptour \
  --external base/js/namespace \
  --external notebook/js/celltoolbar \
  --external jquery \
  --outfile ${DIST}/nbpresent.min.js \
  --standalone nbpresent \
  --transform [ babelify --sourceMapRelative . ] \
  --transform uglifyify \
  ${EXTRA} \
  src/es6/index.es6
