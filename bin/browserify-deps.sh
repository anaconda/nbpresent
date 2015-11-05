#!/bin/bash
. bin/env.sh

browserify \
  --standalone nbpresent-deps \
  --extension es6 \
  --external jquery \
  --external base/js/namespace \
  --external notebook/js/celltoolbar \
  --external jquery \
  --external ./index \
  --transform [ babelify --sourceMapRelative . ] \
  --outfile ${DIST}/nbpresent.deps.min.js \
  src/es6/vendor.es6

ls -lathr ${DIST}
