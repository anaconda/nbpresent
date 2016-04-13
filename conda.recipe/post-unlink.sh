"${PREFIX}/bin/jupyter" nbextension disble --sys-prefix --py "${PKG_NAME}"
"${PREFIX}/bin/jupyter" serverextension disable --sys-prefix --py "${PKG_NAME}"
