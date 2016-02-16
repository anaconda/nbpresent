from subprocess import Popen
import sys

from ._env import (
    JS,
    SRC,
    join,
    node_bin,
    external,
    extension,
    transform,
    IS_WIN,
)


def main(**opts):
    args = [
        node_bin("browserify"),
        "--standalone", "nbpresent-deps",
    ] + extension + external(
        "jquery", "base/js/namespace", "notebook/js/celltoolbar"
    ) + transform + [
        "--outfile", join(JS, "nbpresent.deps.min.js"),
        join(SRC, "es6", "vendor.es6")
    ] + opts.get("browserify", [])
    return Popen(args, shell=IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
