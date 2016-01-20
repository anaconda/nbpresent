SRC_DIR=$RECIPE_DIR/..
cd $SRC_DIR
npm install .
npm run dist
python setup.py install
