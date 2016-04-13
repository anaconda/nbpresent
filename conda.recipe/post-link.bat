"%PREFIX%\Scripts\jupyter" nbextension enable --sys-prefix  --py nbpresent && "%PREFIX%\Scripts\jupyter" serverextension enable --sys-prefix --py nbpresent && if errorlevel 1 exit 1
