#!/bin/bash
. bin/env.sh

lessc \
  --autoprefix \
  --clean-css="--s1 --advanced --compatibility=ie8" \
  --verbose \
  src/less/index.less \
  ${DIST}/nbpresent.min.css

times
