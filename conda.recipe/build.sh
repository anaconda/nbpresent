npm install -g npm@latest
npm install .
npm run build:release
rm -rf "${PREFIX}/node_modules"
"${PYTHON}" setup.py install
