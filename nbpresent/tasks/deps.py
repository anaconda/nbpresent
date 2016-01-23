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
        "--standalone", "nbpresent-deps",
    ] + extension + external(
        "jquery", "base/js/namespace", "notebook/js/celltoolbar"
    ) + transform + [
        "--outfile", join(DIST, "nbpresent.deps.min.js"),
        join(SRC, "es6", "vendor.es6")
    ]
    return Popen(args, shell=True).wait()


if __name__ == "__main__":
    sys.exit(main())
