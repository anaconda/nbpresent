#!/usr/bin/env python

import argparse
from os.path import dirname, abspath, join

from notebook.nbextensions import install_nbextension
from notebook.services.config import ConfigManager


def install(user=False, symlink=False, overwrite=False, enable=False,
            **kwargs):
    """Install the nbpresent nbextension.

    Parameters
    ----------
    user: bool
        Install for current user instead of system-wide.
    symlink: bool
        Symlink instead of copy (for development).
    overwrite: bool
        Overwrite previously-installed files for this extension
    enable: bool
        Enable the extension on every notebook launch
    **kwargs: keyword arguments
        Other keyword arguments passed to the install_nbextension command
    """
    print("Installing nbpresent nbextension...")
    directory = join(dirname(abspath(__file__)), 'static', 'nbpresent')
    install_nbextension(directory, destination='nbpresent',
                        symlink=symlink, user=user, overwrite=overwrite,
                        **kwargs)

    if enable:
        print("Enabling nbpresent at every notebook launch...")
        cm = ConfigManager()
        cm.update('notebook',
                  {"load_extensions": {"nbpresent/nbpresent.min": True}})


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
    args = parser.parse_args()
    install(user=args.user, symlink=args.symlink, overwrite=args.force,
            enable=args.enable)
