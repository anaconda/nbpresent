#!/usr/bin/env python
# -*- coding: utf-8 -*-
from setuptools import setup
import json

with open("package.json") as fp:
    pkg = json.load(fp)

with open('./README.rst') as readme:
    README = readme.read()

setup(
    name=pkg["name"],
    version=pkg["version"],
    description=pkg["description"],
    long_description=README,
    author=pkg["author"]["name"],
    author_email="nbollweg@continuum.io",
    license=pkg["license"],
    url=pkg["homepage"],
    keywords="ipython jupyter markdown presentation slides revealjs d3",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Framework :: IPython",
        "Programming Language :: Python",
        "License :: OSI Approved :: BSD License"
    ],
    packages=["nbpresent"],
    setup_requires=["notebook"],
    tests_require=["nose", "requests", "coverage"],
    include_package_data=True,
    entry_points={
        'console_scripts': ['nbpresent=nbpresent.export:main'],
    }
)
