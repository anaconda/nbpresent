from subprocess import Popen
import sys

from ._env import (
    DIST,
    SRC,
    join,
    node_bin,
    external,
    extension,
    transform,
)


def main():
    args = [
        node_bin("browserify"),
        "--standalone", "nbpresent-notebook",
    ] + extension + external(
        "bootstraptour",
        "base/js/namespace",
        "notebook/js/celltoolbar",
        "jquery",
        "d3",
        "html2canvas",
        "baobab",
        "uuid",
        "nbpresent-deps"
    ) + transform + [
        "--outfile", join(DIST, "nbpresent.notebook.min.js"),
        join(SRC, "es6", "mode", "notebook.es6")
    ]
    return Popen(args, shell=True).wait()


if __name__ == "__main__":
    sys.exit(main())
