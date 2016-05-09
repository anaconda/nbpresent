pushd .
cd /D %PREFIX%\..\..\pkgs
rmdir /s /q "\\?\%cd%\.trash" || echo "no trash to delete"
popd

CALL npm install --parseable || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run test || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

REM force clean of pkg trash
rmdir /s /q "\\?\%cd%\node_modules"
