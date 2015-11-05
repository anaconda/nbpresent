import os

from nbconvert.exporters.html import HTMLExporter

APP_ROOT = os.path.abspath(os.path.dirname(__file__))
ASSETS = os.path.join(APP_ROOT, "static", "nbpresent")


class PresentExporter(HTMLExporter):
    def from_notebook_node(self, nb, resources=None, **kw):
        resources = self._init_resources(resources)

        return super(PresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )
