import sys
import os
import shutil

from ._env import (
    DIST
)


def main(**opts):
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

if __name__ == "__main__":
    sys.exit(main())
