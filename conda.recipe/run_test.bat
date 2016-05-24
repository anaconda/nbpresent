pushd .
cd /D %PREFIX%\..\..\pkgs
attrib -r -a /s /d
(rmdir /s /q "\\?\%cd%\.trash" 2> NUL) || echo "some issues cleaning up"

popd

CALL npm install || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run test || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

REM force clean of pkg trash
attrib -r -a /s /d
(rmdir /s /q "\\?\%cd%\node_modules" 2> NUL) || echo "some issues cleaning up"
