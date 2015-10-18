#!/bin/bash
DIST=nbpresent/static/nbpresent

mkdir -p ${DIST}

browserify \
  --extension es6 \
  --external base/js/namespace \
  --outfile ${DIST}/nbpresent.js \
  --standalone nbpresent \
  --transform [ babelify --sourceMapRelative . ] \
  src/es6/index.es6
