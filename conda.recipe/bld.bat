npm install .
npm run dist
"%PYTHON%" setup.py install
if errorlevel 1 exit 1
