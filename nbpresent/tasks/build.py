import sys

from . import (
    deps,
    index,
    less,
    notebook,
)


def main():
    return sum([it.main() for it in [
        deps,
        index,
        notebook,
        less,
    ]])

if __name__ == "__main__":
    sys.exit(main())
