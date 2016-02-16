import sys
import shutil

from ._env import (
    JS,
    SRC,
    join,
)


def main(**opts):
    shutil.copyfile(
        join(SRC, "js", "index.js"),
        join(JS, "nbpresent.min.js")
    )
    return 0

if __name__ == "__main__":
    sys.exit(main())
