"${PREFIX}/bin/pip" install -e git+https://github.com/ellisonbg/notebook.git#egg=notebook
"${PREFIX}/bin/npm" install -g npm@latest --no-progress --no-spin
"${PREFIX}/bin/npm" install . --no-progress --no-spin
"${PREFIX}/bin/npm" run test --no-progress --no-spin
