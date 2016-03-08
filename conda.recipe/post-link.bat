"%PREFIX%\Scripts\pip" install -e git+https://github.com/ellisonbg/notebook.git#egg=notebook

"%PREFIX%\Scripts\jupyter" nbextension install --py="%PKG_NAME%" --overwrite --sys-prefix
"%PREFIX%\Scripts\jupyter" nbextension enable --py="%PKG_NAME%" --sys-prefix
"%PREFIX%\Scripts\jupyter" serverextension enable --py="%PKG_NAME%" --sys-prefix
"%PREFIX%\Scripts\pip" uninstall notebook -y
errorlevel 1 exit 1
