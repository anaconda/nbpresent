import os

try:
    from unittest.mock import patch
except ImportError:
    # py2
    from mock import patch

from notebook import jstest
from nbpresent.install import install

here = os.path.dirname(__file__)


class NBPresentTestController(jstest.JSController):
    """ Javascript test subclass that installs widget nbextension in test
        environment
    """
    def __init__(self, section, *args, **kwargs):
        extra_args = kwargs.pop('extra_args', None)
        super(NBPresentTestController, self).__init__(section, *args, **kwargs)

        test_cases = os.path.join(here, 'js')
        js_test_dir = jstest.get_js_test_dir()
        includes = '--includes=' + os.path.join(js_test_dir, 'util.js')

        self.cmd = ['casperjs', 'test', test_cases, includes,
                    '--engine={}'.format(self.engine)]

        if extra_args is not None:
            self.cmd = self.cmd + extra_args

    def setup(self):
        super(NBPresentTestController, self).setup()
        with patch.dict(os.environ, self.env):
            install_kwargs = dict(enable=True, user=True)
            if "CONDA_ENV_PATH" in os.environ:
                install_kwargs.pop("user")
                install_kwargs.update(prefix=os.environ["CONDA_ENV_PATH"])
            install(**install_kwargs)


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
