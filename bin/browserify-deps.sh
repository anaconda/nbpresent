#!/bin/bash
. bin/env.sh

browserify \
  --standalone nbpresent-deps \
  --extension es6 \
  --external base/js/namespace \
  --external jquery \
  --external notebook/js/celltoolbar \
  --external underscore \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.deps.min.js \
  src/es6/vendor.es6

ls -lathr ${DIST}
