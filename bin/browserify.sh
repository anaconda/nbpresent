#!/bin/bash
. bin/env.sh
#  ${EXTRA} \

UGLIFY=./node_modules/uglifyify/node_modules/uglify-js/bin/uglifyjs
#| $UGLIFY -c \

cat src/js/index.js \
  > ${DIST}/nbpresent.min.js \

ls -lathr ${DIST}
