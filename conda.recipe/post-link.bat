CALL jupyter nbextension enable nbpresent --py --sys-prefix  || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%

CALL jupyter serverextension enable nbpresent --py --sys-prefix  || EXIT /B 1
IF %ERRORLEVEL% NEQ 0 EXIT /B %ERRORLEVEL%
