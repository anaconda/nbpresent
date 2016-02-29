npm install -g npm@latest --no-progress --no-spin
npm install . --no-progress --no-spin
npm run build:release
rm -rf "${PREFIX}/node_modules"
"${PYTHON}" setup.py install
