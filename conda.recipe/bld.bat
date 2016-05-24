pushd .
cd /D %PREFIX%\..\..\pkgs
attrib -r -a /s /d
(rmdir /s /q "\\?\%cd%\.trash" 2> NUL) || echo "some issues cleaning up"
cd ..\..\conda-bld
(attrib -r -a /s /d 2> NUL) || echo "some issues clearing attribs"
popd

CALL npm install || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL npm run build:release || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

attrib -r -a /s /d
(rmdir /s /q "\\?\%cd%\node_modules" 2> NUL) || echo "some issues cleaning up"
"%PYTHON%" setup.py install --single-version-externally-managed --record=record.txt

CALL "%PREFIX%\Scripts\jupyter-nbextension" install nbpresent --py --sys-prefix --overwrite || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%
