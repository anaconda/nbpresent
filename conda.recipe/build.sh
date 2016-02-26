npm install -g npm@latest --no-progress
npm install . --no-progress
npm run build:release
rm -rf "${PREFIX}/node_modules"
"${PYTHON}" setup.py install
