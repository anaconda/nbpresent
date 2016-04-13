import os
import glob
import subprocess

try:
    from unittest.mock import patch
except ImportError:
    # py2
    from mock import patch

from notebook import jstest

import platform

IS_WIN = "Windows" in platform.system()

here = os.path.dirname(__file__)

# global npm installs are bad, add the local node_modules to the path
os.environ["PATH"] = os.pathsep.join([
    os.environ["PATH"],
    os.path.abspath(os.path.join(here, "node_modules", ".bin"))
])

TEST_LOG = ".jupyter.jstest.log"


class NBPresentTestController(jstest.JSController):
    """ Javascript test subclass that installs widget nbextension in test
        environment
    """
    def __init__(self, section, *args, **kwargs):
        extra_args = kwargs.pop('extra_args', None)
        super(NBPresentTestController, self).__init__(section, *args, **kwargs)
        self.xunit = True

        test_cases = glob.glob(os.path.join(here, 'js', 'test_notebook_*.js'))
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

        if IS_WIN:
            self.cmd[0] = "{}.cmd".format(self.cmd[0])

    def launch(self, buffer_output=False, capture_output=False):
        # print('*** ENV:', self.env)  # dbg
        # print('*** CMD:', self.cmd)  # dbg
        env = os.environ.copy()
        env.update(self.env)
        if buffer_output:
            capture_output = True
        self.stdout_capturer = c = jstest.StreamCapturer(
            echo=not buffer_output)
        c.start()
        stdout = c.writefd if capture_output else None
        # stderr = subprocess.STDOUT if capture_output else None
        self.process = subprocess.Popen(
            self.cmd,
            stderr=subprocess.PIPE,
            stdout=stdout,
            env=env)

    def wait(self):
        self.process.communicate()
        self.stdout_capturer.halt()
        self.stdout = self.stdout_capturer.get_buffer()
        return self.process.returncode

    def add_xunit(self):
        """ Hack the setup in the middle (after paths, before server)
        """
        super(NBPresentTestController, self).add_xunit()

        # commands to run to enable the system-of-interest
        cmds = [
            ["nbextension", "install"],
            ["nbextension", "enable"],
            ["serverextension", "enable"]
        ]

        # ensure the system-of-interest is installed and enabled!
        with patch.dict(os.environ, self.env):
            args = ["--py", "nbpresent"]
            prefix = (["--sys-prefix"] if ("CONDA_ENV_PATH" in os.environ) or
                      ("CONDA_DEFAULT_ENV" in os.environ) else ["--user"])

            for cmd in cmds:
                final_cmd = ["jupyter"] + cmd + prefix + args
                proc = subprocess.Popen(final_cmd,
                                        stdout=subprocess.PIPE,
                                        env=os.environ)
                out, err = proc.communicate()
                if proc.returncode:
                    raise Exception([proc.returncode, final_cmd, out, err])

    def cleanup(self):
        if hasattr(self, "stream_capturer"):
            captured = self.stream_capturer.get_buffer().decode(
                'utf-8', 'replace')
            with open(TEST_LOG, "a+") as fp:
                fp.write("-----------------------\n{} results:\n{}\n".format(
                    self.section,
                    self.server_command))
                fp.write(captured)

        super(NBPresentTestController, self).cleanup()


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
