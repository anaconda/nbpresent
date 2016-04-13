"%PREFIX%\Scripts\jupyter" nbextension disable --sys-prefix --py nbpresent && "%PREFIX%\Scripts\jupyter" serverextension disable --sys-prefix --py nbpresent && if errorlevel 1 exit 1
