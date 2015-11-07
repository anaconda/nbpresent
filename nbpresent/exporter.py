import os
import json

from nbconvert.exporters.html import HTMLExporter

APP_ROOT = os.path.abspath(os.path.dirname(__file__))
ASSETS = os.path.join(APP_ROOT, "static", "nbpresent")


class PresentExporter(HTMLExporter):
    def from_notebook_node(self, nb, resources=None, **kw):
        resources = self._init_resources(resources)
        resources.update(nbpresent={
            "metadata": json.dumps(nb.metadata.get("nbpresent", {}),
                                   indent=2,
                                   sort_keys=True)
        })

        return super(PresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )
