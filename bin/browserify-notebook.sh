#!/bin/bash
. bin/env.sh
# ${EXTRA} \

browserify \
  --standalone nbpresent-notebook \
  --extension es6 \
  --external baobab \
  --external base/js/namespace \
  --external bootstraptour \
  --external d3 \
  --external html2canvas \
  --external jquery \
  --external nbpresent-deps \
  --external notebook/js/celltoolbar \
  --external underscore \
  --external uuid \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.notebook.min.js \
  src/es6/mode/notebook.es6

ls -lathr ${DIST}
