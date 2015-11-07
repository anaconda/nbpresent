npm install .
npm run build
"%PYTHON%" setup.py install
"%PYTHON%" -m nbpresent.install --force --enable
if errorlevel 1 exit 1

:: Add more build steps here, if they are necessary.

:: See
:: http://docs.continuum.io/conda/build.html
:: for a list of environment variables that are set during the build process.
