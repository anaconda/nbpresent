#!/bin/bash
. bin/env.sh

# ${EXTRA} \
# --transform uglifyify \

browserify \
  --extension es6 \
  --external bootstraptour \
  --external base/js/namespace \
  --external notebook/js/celltoolbar \
  --external jquery
  --outfile ${DIST}/nbpresent.min.js \
  --standalone nbpresent \
  --transform [ babelify --sourceMapRelative . ] \
  src/es6/index.es6
