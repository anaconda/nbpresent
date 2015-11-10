SRC_DIR=$RECIPE_DIR/..
cd $SRC_DIR
npm install .
npm run build
python setup.py install
