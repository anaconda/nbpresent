"${PREFIX}/bin/pip" install -e git+https://github.com/ellisonbg/notebook.git#egg=notebook

"${PREFIX}/bin/jupyter" nbextension install --py="${PKG_NAME}" --overwrite --sys-prefix
"${PREFIX}/bin/jupyter" nbextension enable --py="${PKG_NAME}" --sys-prefix
"${PREFIX}/bin/jupyter" serverextension enable --py="${PKG_NAME}" --sys-prefix

"${PREFIX}/bin/pip" uninstall notebook -y
