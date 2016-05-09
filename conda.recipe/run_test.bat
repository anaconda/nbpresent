pushd .
cd /D %PREFIX%\..\..\pkgs
rmdir /s /q "\\?\%cd%\.trash" || echo "some issues cleaning up"

popd

CALL npm install --parseable || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run test || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

REM force clean of pkg trash
rmdir /s /q "\\?\%cd%\node_modules" || echo "some issues cleaning up"
