cd "%RECIPE_DIR%\.."
"%PREFIX%\Scripts\npm.cmd" install -g npm@latest && "%PREFIX%\Scripts\npm.cmd" install . && "%PREFIX%\Scripts\npm.cmd" run build:release && "%PYTHON%" setup.py install
if errorlevel 1 exit 1
