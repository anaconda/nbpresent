from nbsetuptools import setup, find_static
from os.path import abspath, dirname, join

setup(
    name="nbpresent",
    version="0.1.0",
    static=join(abspath(dirname(__file__)), 'static', 'nbpresent')
)
