import os
import sys
import glob

try:
    from unittest.mock import patch
except ImportError:
    # py2
    from mock import patch

import requests

from notebook import jstest
from ipython_genutils.tempdir import TemporaryDirectory

from nbpresent.install import install

here = os.path.dirname(__file__)

# global npm installs are bad, add the local node_modules to the path
os.environ["PATH"] = os.pathsep.join([
    os.environ["PATH"],
    os.path.abspath(os.path.join(here, "node_modules", ".bin"))
])


class NBPresentTestController(jstest.JSController):
    """ Javascript test subclass that installs widget nbextension in test
        environment
    """
    def __init__(self, section, *args, **kwargs):
        extra_args = kwargs.pop('extra_args', None)
        super(NBPresentTestController, self).__init__(section, *args, **kwargs)

        test_cases = glob.glob(os.path.join(here, 'js', 'test_*.js'))
        js_test_dir = jstest.get_js_test_dir()

        includes = [
            os.path.join(js_test_dir, 'util.js')
        ] + glob.glob(os.path.join(here, 'js', '_*.js'))

        self.cmd = [
            'casperjs', 'test',
            '--includes={}'.format(",".join(includes)),
            '--engine={}'.format(self.engine)
        ] + test_cases

        if extra_args is not None:
            self.cmd = self.cmd + extra_args

    def setup(self):
        # call the hacked setup
        self._setup()

        # patch
        with patch.dict(os.environ, self.env):
            install_kwargs = dict(enable=True, user=True)
            if "CONDA_ENV_PATH" in os.environ:
                install_kwargs.pop("user")
                install_kwargs.update(prefix=os.environ["CONDA_ENV_PATH"])
            install(**install_kwargs)

    def _setup(self):
        """ copy pasta from
            https://github.com/jupyter/notebook/blob/4.0.6/notebook/jstest.py
            master has some changes that will ship with 4.1...
        """
        self.ipydir = TemporaryDirectory()
        self.config_dir = TemporaryDirectory()
        self.nbdir = TemporaryDirectory()
        self.home = TemporaryDirectory()
        self.env = {
            'HOME': self.home.name,
            'JUPYTER_CONFIG_DIR': self.config_dir.name,
            'IPYTHONDIR': self.ipydir.name,
        }
        self.dirs.append(self.ipydir)
        self.dirs.append(self.home)
        self.dirs.append(self.config_dir)
        self.dirs.append(self.nbdir)
        os.makedirs(os.path.join(self.nbdir.name, 'sub dir1', 'sub dir 1a'))
        os.makedirs(os.path.join(self.nbdir.name, 'sub dir2', 'sub dir 1b'))

        if self.xunit:
            self.add_xunit()

        # If a url was specified, use that for the testing.
        if self.url:
            try:
                alive = requests.get(self.url).status_code == 200
            except:
                alive = False

            if alive:
                self.cmd.append("--url=%s" % self.url)
            else:
                raise Exception('Could not reach "%s".' % self.url)
        else:
            # start the ipython notebook, so we get the port number
            self.server_port = 0
            self._init_server()
            if self.server_port:
                self.cmd.append("--port=%i" % self.server_port)
            else:
                # don't launch tests if the server didn't start
                self.cmd = [sys.executable, '-c', 'raise SystemExit(1)']


def prepare_controllers(options):
    """Monkeypatched prepare_controllers for running widget js tests

    instead of notebook js tests
    """
    if options.testgroups:
        groups = options.testgroups
    else:
        groups = ['']
    return [NBPresentTestController(g, extra_args=options.extra_args)
            for g in groups], []


def test_notebook():
    with patch.object(jstest, 'prepare_controllers', prepare_controllers):
        jstest.main()


if __name__ == '__main__':
    test_notebook()
