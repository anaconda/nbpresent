"${PREFIX}/bin/npm" install
NBPRESENT_TEST_MODULES="${PWD}/node_modules" \
  "${PREFIX}/bin/npm" run test
