#!/bin/bash
. bin/env.sh

# ${EXTRA} \
# --transform uglifyify \

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
  --external ./vendor \
  --transform [ babelify --sourceMapRelative . ] \
  --outfile ${DIST}/nbpresent.min.js \
  src/es6/vendor.es6

ls -lathr ${DIST}
