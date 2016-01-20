import codecs
import os
import json

from collections import (
    OrderedDict,
    defaultdict
)

from nbconvert.exporters.html import HTMLExporter

from .base import (
    APP_ROOT,
    STANDALONE_ASSETS,
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

        assets = defaultdict(OrderedDict)

        to_inline = NB_ASSETS + STANDALONE_ASSETS

        for filename in to_inline:
            ext = filename.split(".")[-1]
            mode = "rb" if ext in bin_ext else "r"
            with codecs.open(filename, mode, encoding="utf-8") as fp:
                assets[ext].update({
                    os.path.basename(filename): fp.read()
                })

        resources.update(
            nbpresent={
                "metadata": json.dumps(nb.metadata.get("nbpresent", {}),
                                       indent=2,
                                       sort_keys=True)
            },
            nbpresent_assets=assets
        )

        return super(PresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )
