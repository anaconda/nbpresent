from subprocess import Popen
import sys

from ._env import (
    DIST,
    SRC,
    join,
    node_bin,
)


def main():
    args = [
        node_bin("lessc"),
        "--autoprefix",
        "--clean-css",
        join(SRC, "less", "index.less"),
        join(DIST, "nbpresent.min.css")
    ]
    return Popen(args, shell=True).wait()


if __name__ == "__main__":
    sys.exit(main())
