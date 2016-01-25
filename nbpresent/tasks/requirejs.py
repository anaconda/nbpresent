from subprocess import Popen
import sys

from ._env import (
    SRC,
    join,
    node_bin,
)


def main(**opts):
    args = [
        node_bin("r.js"),
        "-o", join(SRC, "js", "build.js"),
    ] + opts.get("requirejs", [])
    return Popen(args).wait()


if __name__ == "__main__":
    sys.exit(main())
