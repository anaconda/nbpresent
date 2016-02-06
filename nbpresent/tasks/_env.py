from os.path import (
    dirname,
    abspath,
    join,
)
import platform


PKG = "nbpresent"

REPO_ROOT = abspath(join(dirname(__file__), "..", ".."))
PKG_ROOT = join(REPO_ROOT, PKG)
SRC = join(REPO_ROOT, "src")
DIST = join(PKG_ROOT, "static", PKG)
JS = join(DIST, "js")
CSS = join(DIST, "css")

IS_WIN = "Windows" in platform.system()


def node_bin(*it):
    return join(REPO_ROOT, "node_modules", ".bin", *it)


def external(*modules):
    # browserify --external
    return sum([["--external", m] for m in modules], [])

transform = [
    "--transform", "[", "babelify", "--sourceMapRelative", ".", "]",
]

extension = ["--extension", "es6"]
