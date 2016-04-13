npm install . --no-progress --no-spin
npm run build:release
rm -rf node_modules
"${PYTHON}" setup.py install
"${PREFIX}/bin/jupyter" nbextension install --overwrite --sys-prefix --py "${PKG_NAME}"
