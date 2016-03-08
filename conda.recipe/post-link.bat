"%PREFIX%\Scripts\pip" install https://github.com/ellisonbg/notebook/archive/nbext-pain.zip

"%PREFIX%\Scripts\jupyter" nbextension install --py="%PKG_NAME%" --overwrite --sys-prefix
"%PREFIX%\Scripts\jupyter" nbextension enable --py="%PKG_NAME%" --sys-prefix
"%PREFIX%\Scripts\jupyter" serverextension enable --py="%PKG_NAME%" --sys-prefix
"%PREFIX%\Scripts\pip" uninstall notebook -y
errorlevel 1 exit 1
