from glob import glob
import os
import socket
import subprocess
import tempfile
import sys
import platform

from ..export import export


IS_WIN = "Windows" in platform.system()


# utility function
def join(*bits):
    return os.path.abspath(os.path.join(*bits))


here = os.path.dirname(__file__)

http_module = None


def node_bin(*bits):
    return os.path.abspath(
        os.path.join(here, "..", "..", "node_modules", ".bin", *bits))

try:
    import http.server as httpd
    http_module = "http.server"
except ImportError:
    import SimpleHTTPServer as httpd
    http_module = "SimpleHTTPServer"

print("nbpresent export test using", httpd)


def unused_port():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(('localhost', 0))
    addr, port = sock.getsockname()
    sock.close()
    return port


def test_export():
    tmpdir = tempfile.mkdtemp()
    env = dict(os.environ)
    env.update(
        NBPRESENT_TEST_HTTP_PORT=str(unused_port()),
        PATH=os.pathsep.join([env["PATH"], node_bin()])
    )

    httpd = subprocess.Popen([
            sys.executable, "-m", http_module,
            env["NBPRESENT_TEST_HTTP_PORT"],
            "--bind=127.0.0.1"
        ],
        cwd=tmpdir)

    try:
        export(
            join(here, "notebooks", "Basics.ipynb"),
            join(tmpdir, "Basics.html"),
            "html")
        args = [
            "casperjs{}".format(".cmd" if IS_WIN else ""),
            "test",
            "--fail-fast",
            "--includes={}".format(
                ",".join(glob(join(here, 'js', '_*.js')))),
        ] + glob(join(here, 'js', 'test_export_*.js'))

        proc = subprocess.Popen(
            args,
            stderr=subprocess.PIPE,
            env=env
        )
        proc.communicate()

        assert proc.returncode == 0
    finally:
        httpd.kill()


if __name__ == '__main__':
    test_export()
