#!/bin/bash
. bin/env.sh
# ${EXTRA} \

browserify \
  --standalone nbpresent-notebook \
  --extension es6 \
  --external bootstraptour \
  --external base/js/namespace \
  --external notebook/js/celltoolbar \
  --external jquery \
  --external d3 \
  --external html2canvas \
  --external baobab \
  --external uuid \
  --external nbpresent-deps \
  --transform [ babelify --sourceMapRelative . ] \
  ${EXTRA} \
  --outfile ${DIST}/nbpresent.notebook.min.js \
  src/es6/mode/notebook.es6

ls -lathr ${DIST}
