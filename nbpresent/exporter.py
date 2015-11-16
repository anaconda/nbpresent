import os
import json
from glob import glob

from nbconvert.exporters.html import HTMLExporter

APP_ROOT = os.path.abspath(os.path.dirname(__file__))
ASSETS = os.path.join(APP_ROOT, "static", "nbpresent")


class PresentExporter(HTMLExporter):
    def __init__(self, *args, **kwargs):
        # TODO: this probably isn't the right way
        kwargs.update(
            template_file="nbpresent",
            template_path=[os.path.join(APP_ROOT, "templates")]
        )
        super(PresentExporter, self).__init__(*args, **kwargs)

    def from_notebook_node(self, nb, resources=None, **kw):
        resources = self._init_resources(resources)
        resources.update(
            nbpresent={
                "metadata": json.dumps(nb.metadata.get("nbpresent", {}),
                                       indent=2,
                                       sort_keys=True)
            },
            outputs={
                filename: open(filename).read()
                for filename in glob(os.path.join(ASSETS, "*.*"))
            }
        )

        return super(PresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )


class PDFPresentExporter(PresentExporter):
    def from_notebook_node(self, *args, **kwargs):
        super(PDFPresentExporter, self).__init__(*args, **kwargs)

    def from_notebook_node(self, nb, resources=None, **kw):
        return super(PDFPresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )
