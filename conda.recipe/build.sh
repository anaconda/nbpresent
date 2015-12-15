SRC_DIR=$RECIPE_DIR/..
cd $SRC_DIR
npm install .
npm run lint
npm run dist
python setup.py develop
npm run docs
python setup.py install
