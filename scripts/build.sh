#!/bin/bash
DIST=nbpresent/static/nbpresent

mkdir -p ${DIST}

browserify \
  --extension es6 \
  --external base/js/namespace \
  --outfile ${DIST}/nbpresent.min.js \
  --standalone nbpresent \
  --transform [ babelify --sourceMapRelative . ] \
  --transform uglifyify \
  --debug \
  src/es6/index.es6 &

lessc \
  --autoprefix \
  --clean-css \
  src/less/index.less \
  ${DIST}/nbpresent.min.css &
