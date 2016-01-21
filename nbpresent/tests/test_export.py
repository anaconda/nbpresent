from glob import glob
import os
import sys
from subprocess import Popen

from ..export import export

here = os.path.dirname(__file__)


def join(*bits): return os.path.abspath(os.path.join(*bits))


NBPRESENT_HTML = os.path.abspath(
    join(here, "..", "static"))

http_module = None

try:
    import http.server as httpd
    http_module = "http.server"
except ImportError:
    import SimpleHTTPServer as httpd
    http_module = "SimpleHTTPServer"


print("Using", http_module, httpd)


def test_export():
    httpd = Popen([
            sys.executable, "-m", http_module,
            "--bind=127.0.0.1"
        ],
        cwd=NBPRESENT_HTML)

    export(
        join(here, "..", "..", "notebooks", "index.ipynb"),
        join(NBPRESENT_HTML, "index.html"),
        "html")

    # TODO: this will break on windows
    assert 0 == Popen([
            "casperjs", "test",
            "--includes={}".format(",".join(glob(join(here, 'js', '_*.js')))),
        ] + glob(join(here, 'js', 'test_export_*.js'))).wait()

    httpd.kill()


if __name__ == '__main__':
    test_export()
