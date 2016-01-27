cd "${RECIPE_DIR}/.."
npm install .
npm run build:release
"${PYTHON}" setup.py install
