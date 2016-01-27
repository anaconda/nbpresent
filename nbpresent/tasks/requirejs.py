from subprocess import Popen
import sys

from ._env import (
    SRC,
    join,
    node_bin,
    IS_WIN,
)


def main(**opts):
    args = [
        node_bin("r.js{}".format(".cmd" if IS_WIN else "")),
        "-o", join(SRC, "js", "build.js"),
    ] + opts.get("requirejs", [])
    return Popen(args, shell=IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
