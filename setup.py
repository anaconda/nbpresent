#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import setup


# should be loaded below
__version__ = None

with open('nbpresent/_version.py') as version:
    exec(version.read())

setup(
    name="nbpresent",
    version=__version__,
    description="Next generation slides from Jupyter Notebooks",
    author="Nicholas Bollweg",
    author_email="nbollweg@continuum.io",
    license="BSD-3-Clause",
    url="https://github.com/Anaconda-Server/nbpresent",
    keywords="ipython jupyter inkscape markdown presentation revealjs d3",
    classifiers=["Development Status :: 4 - Beta",
                 "Framework :: IPython",
                 "Programming Language :: Python",
                 "License :: OSI Approved :: BSD License"],
    packages=["nbpresent"],
    include_package_data=True,
    entry_points={
        'console_scripts': ['nbpresent=nbpresent.export:main'],
    }
)
