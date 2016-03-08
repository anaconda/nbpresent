"${PREFIX}/bin/pip" install -e git+git@github.com:ellisonbg/notebook.git@nbext-pain#egg=NotebookFortyTwo

"${PREFIX}/bin/jupyter" nbextension install --py="${PKG_NAME}" --overwrite --sys-prefix
"${PREFIX}/bin/jupyter" nbextension enable --py="${PKG_NAME}" --sys-prefix
"${PREFIX}/bin/jupyter" serverextension enable --py="${PKG_NAME}" --sys-prefix

"${PREFIX}/bin/pip" uninstall notebook -y
