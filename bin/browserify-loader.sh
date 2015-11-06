#!/bin/bash
. bin/env.sh
# ${EXTRA} \

browserify \
  --standalone nbpresent \
  --extension es6 \
  --external bootstraptour \
  --external base/js/namespace \
  --external notebook/js/celltoolbar \
  --external jquery \
  --external d3 \
  --external html2canvas \
  --external baobab \
  --external node-uuid \
  --external nbpresent-deps \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.loader.min.js \
  src/es6/loader.es6

ls -lathr ${DIST}
