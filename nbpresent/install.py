#!/usr/bin/env python

import argparse
import os
from os.path import dirname, abspath, join

from notebook.nbextensions import install_nbextension
from notebook.services.config import ConfigManager


def install(conda_env=False, enable=False, **kwargs):
    """Install the nbpresent nbextension assets and optionally enables the
       nbextension and server extension for every run.

    Parameters
    ----------
    conda_env: bool
        Install for all users of current conda environment
    enable: bool
        Enable the extension on every notebook launch
    **kwargs: keyword arguments
        Other keyword arguments passed to the install_nbextension command
    """
    directory = join(dirname(abspath(__file__)), 'static', 'nbpresent')
    print("Installing nbpresent frontend assets...")

    if conda_env:
        env_path = os.environ.get("CONDA_ENV_PATH", None)
        # for the build
        if env_path is None:
            env_path = os.environ.get("PREFIX", None)

        if env_path is not None:
            kwargs["prefix"] = env_path
        else:
            raise ValueError("Couldn't detect conda environment")

    install_nbextension(directory, destination='nbpresent', **kwargs)

    if enable:
        print("Enabling nbpresent frontend at every notebook launch...")
        cm = ConfigManager()
        cm.update(
            'notebook', dict(
                load_extensions={"nbpresent/nbpresent.min": True},
            )
        )
        print("Enabling nbpresent server component...")
        cm.update(
            'NotebookApp', dict(
                server_extensions=["nbpresent"]
            )
        )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Installs nbpresent nbextension")
    parser.add_argument(
        "-u", "--user",
        help="Install as current user instead of system-wide",
        action="store_true")
    parser.add_argument(
        "-s", "--symlink",
        help="Symlink instead of copying files",
        action="store_true")
    parser.add_argument(
        "-f", "--force",
        help="Overwrite any previously-installed files for this extension",
        action="store_true")
    parser.add_argument(
        "-e", "--enable",
        help="Automatically load extension on notebook launch",
        action="store_true")
    parser.add_argument(
        "-c", "--conda_env",
        help="Install for all users of the current conda environment",
        action="store_true")
    args = parser.parse_args()
    kwargs = dict(
        user=args.user,
        symlink=args.symlink,
        overwrite=args.force
    )
    install(enable=args.enable, conda_env=args.conda_env)
