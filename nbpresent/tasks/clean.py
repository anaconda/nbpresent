import sys
import os
import shutil

from ._env import (
    DIST
)


def main(**opts):
    shutil.rmtree(DIST)
    os.makedirs(DIST)

if __name__ == "__main__":
    sys.exit(main())
