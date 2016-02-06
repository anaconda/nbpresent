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
    IS_WIN
)


def main(**opts):
    args = [
        node_bin("browserify"),
        "--standalone", "nbpresent-standalone",
    ] + extension + external(
        "jquery",
        "nbpresent-deps"
    ) + transform + [
        "--outfile", join(JS, "nbpresent.standalone.min.js"),
        join(SRC, "es6", "mode", "standalone.es6")
    ] + opts.get("browserify", [])
    return Popen(args, shell=IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
