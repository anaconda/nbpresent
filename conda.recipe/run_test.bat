CALL npm install --parseable || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run test || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

REM force clean of pkg trash
pushd
cd %PREFIX%\..\pkgs
rmdir /s /q "\\?\%cd%\.trash"
popd
