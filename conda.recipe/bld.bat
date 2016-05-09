pushd .
cd /D %PREFIX%\..\..\pkgs
rmdir /s /q "\\?\%cd%\.trash" || echo "no trash to delete"
popd

CALL npm install --parseable || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run build:release  || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

rmdir /s /q "\\?\%cd%\node_modules"
"%PYTHON%" setup.py install

CALL "%PREFIX%\Scripts\jupyter-nbextension" install nbpresent --py --sys-prefix --overwrite || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%
