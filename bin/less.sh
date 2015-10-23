#!/bin/bash
. bin/env.sh

lessc \
  --autoprefix \
  --clean-css \
  --verbose \
  src/less/index.less \
  ${DIST}/nbpresent.min.css

times
