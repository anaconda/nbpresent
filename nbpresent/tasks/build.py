import sys

from . import (
    deps,
    less,
    index,
    notebook,
    standalone,
    requirejs,
)


def main(**opts):
    return sum([it.main(**opts) for it in [
        less,
        deps,
        index,
        notebook,
        standalone,
        requirejs,
    ]])

if __name__ == "__main__":
    opts = {}
    if "dist" in sys.argv[1:]:
        opts.update(
            browserify=["-g", "uglifyify"]
        )
    sys.exit(main(**opts))
