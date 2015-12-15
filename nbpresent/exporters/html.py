import codecs
import os
import json
from glob import glob

from nbconvert.exporters.html import HTMLExporter

from .base import (
    APP_ROOT,
    ASSETS,
    NB_ASSETS
)


class PresentExporter(HTMLExporter):
    def __init__(self, *args, **kwargs):
        # TODO: this probably isn't the right way
        kwargs.update(
            template_file="nbpresent",
            template_path=[os.path.join(APP_ROOT, "templates")]
        )
        super(PresentExporter, self).__init__(*args, **kwargs)

    def from_notebook_node(self, nb, resources=None, **kw):
        bin_ext = ["woff", "ttf"]

        resources = self._init_resources(resources)
        resources.update(
            nbpresent={
                "metadata": json.dumps(nb.metadata.get("nbpresent", {}),
                                       indent=2,
                                       sort_keys=True)
            },
            outputs={
                filename: codecs.open(
                    filename,
                    "rb" if filename.split(".")[-1] in bin_ext else "r",
                    encoding="utf-8"
                ).read()
                for filename
                in list(glob(os.path.join(ASSETS, "*.*"))) + NB_ASSETS
            }
        )

        return super(PresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )
