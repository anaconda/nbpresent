import sys
import os
import shutil

from ._env import (
    CSS,
    JS
)


def main(**opts):
    for clean_dir in [JS, CSS]:
        os.path.exists(clean_dir) and shutil.rmtree(clean_dir)
        os.makedirs(clean_dir)


if __name__ == "__main__":
    sys.exit(main())
