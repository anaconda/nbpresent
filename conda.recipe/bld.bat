pushd .
cd /D %PREFIX%\..\..\pkgs
(rmdir /s /q "\\?\%cd%\.trash" 2> NUL) || echo "some issues cleaning up"
popd

CALL npm install || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run build:release || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

(rmdir /s /q "\\?\%cd%\node_modules" 2> NUL) || echo "some issues cleaning up"
"%PYTHON%" setup.py install

CALL "%PREFIX%\Scripts\jupyter-nbextension" install nbpresent --py --sys-prefix --overwrite || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%
