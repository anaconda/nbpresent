from subprocess import Popen
import sys

from ._env import (
    CSS,
    SRC,
    IS_WIN,
    join,
    node_bin,
)


def main(**opts):
    args = [
        node_bin("lessc"),
        "--autoprefix",
        "--clean-css",
        "--include-path={}".format(node_bin("..")),
        join(SRC, "less", "index.less"),
        join(CSS, "nbpresent.min.css")
    ] + opts.get("less", [])
    return Popen(args, shell=IS_WIN).wait()


if __name__ == "__main__":
    sys.exit(main())
