SRC_DIR="$RECIPE_DIR/.."
cd "$SRC_DIR"
npm install .
npm run build:release
"${PYTHON}" setup.py install
