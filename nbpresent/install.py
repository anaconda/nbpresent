#!/usr/bin/env python

import argparse
import os
from os.path import dirname, abspath, join, exists
import inspect

from notebook.nbextensions import install_nbextension
from notebook.services.config import ConfigManager

install_kwargs = list(inspect.signature(install_nbextension).parameters)


def install(enable=False, **kwargs):
    """Install the nbpresent nbextension assets and optionally enables the
       nbextension and server extension for every run.

    Parameters
    ----------
    enable: bool
        Enable the extension on every notebook launch
    **kwargs: keyword arguments
        Other keyword arguments passed to the install_nbextension command
    """
    directory = join(dirname(abspath(__file__)), 'static', 'nbpresent')

    kwargs = {k: v for k, v in kwargs.items() if not (v is None)}

    kwargs["destination"] = "nbpresent"

    install_nbextension(directory, **kwargs)

    if enable:
        if "prefix" in kwargs:
            path = join(kwargs["prefix"], "etc", "jupyter")
            if not exists(path):
                os.makedirs(path)

        cm = ConfigManager(config_dir=path)
        print("Enabling for", cm.config_dir)
        print("Enabling nbpresent server component...")
        cm.update(
            "jupyter_notebook_config", {
                "notebook": {
                    "load_extensions": {"nbpresent/nbpresent.min": True}
                },
                "NotebookApp": {
                    "server_extensions": ["nbpresent"]
                }
            }
        )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Installs nbpresent nbextension")
    parser.add_argument(
        "-e", "--enable",
        help="Automatically load extension on notebook launch",
        action="store_true")

    [parser.add_argument("--{}".format(arg), action="store", nargs='?')
        for arg in install_kwargs]

    install(**parser.parse_args().__dict__)
