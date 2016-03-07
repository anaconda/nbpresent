"${PREFIX}/bin/pip" install -e git@github.com:ellisonbg/notebook.git@nbext-pain#egg=NotebookFortyTwo
"${PREFIX}/bin/npm" install -g npm@latest --no-progress --no-spin
"${PREFIX}/bin/npm" install . --no-progress --no-spin
"${PREFIX}/bin/npm" run test --no-progress --no-spin
