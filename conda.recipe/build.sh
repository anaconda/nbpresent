npm install . --no-progress --no-spin
npm run build:release
rm -rf node_modules
"${PYTHON}" setup.py install
"${PREFIX}/bin/jupyter-nbextension" install nbpresent --py --sys-prefix --overwrite
