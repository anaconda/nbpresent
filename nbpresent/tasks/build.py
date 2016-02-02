import sys
from multiprocessing import Pool, cpu_count
from importlib import import_module

from nbpresent.tasks import (
    requirejs,
    clean,
)


def _run(mod_opt, *args, **opts):
    print("started {0} with {1}".format(*mod_opt))
    task = import_module("nbpresent.tasks.{}".format(mod_opt[0]))
    task.main(**mod_opt[1])
    print("...completed {}".format(mod_opt[0]))
    return 0


def main(**opts):
    clean.main()

    pool = Pool(processes=cpu_count())

    tasks = [
        "less",
        "deps",
        "index",
        "notebook",
        "standalone",
    ]

    pool.map(_run, zip(tasks, [opts] * len(tasks)))

    requirejs.main(**opts)

    return 0

if __name__ == "__main__":
    opts = {}
    args = sys.argv[1:]
    if "release" in args:
        opts.update(
            browserify=["-g", "uglifyify"]
        )
    if "dev" in args:
        opts.update(
            browserify=["--debug"],
            less=["--source-map-map-inline"]
        )

    sys.exit(main(**opts))
