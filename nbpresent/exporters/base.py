import os

from notebook import DEFAULT_STATIC_FILES_PATH

APP_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ASSETS = os.path.join(APP_ROOT, "static", "nbpresent")
NB_ASSETS = [os.path.join(DEFAULT_STATIC_FILES_PATH, *bits) for bits in [
    ["components", "requirejs", "require.js"]
]]
STANDALONE_ASSETS = [
    os.path.join(ASSETS, "js", "nbpresent.static.min.js"),
    os.path.join(ASSETS, "css", "nbpresent.min.css"),
]
