cd "${RECIPE_DIR}/.."
npm install -g npm@latest
npm install .
npm run build:release
"${PYTHON}" setup.py install
