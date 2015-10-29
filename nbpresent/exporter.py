import os

from nbconvert.exporters.html import HTMLExporter

APP_ROOT = os.path.abspath(os.path.dirname(__file__))
ASSETS = os.path.join(APP_ROOT, "static", "nbpresent")


class PresentExporter(HTMLExporter):
    def iter_inline_assets(self, nb, asset_type):
        # TODO: load from entry points, used metadata
        if asset_type == "js":
            yield os.path.join(ASSETS, "nbpresent.min.js")
        elif asset_type == "css":
            yield os.path.join(ASSETS, "nbpresent.min.css")

    def from_notebook_node(self, nb, resources=None, **kw):
        resources = self._init_resources(resources)
        inline = resources["nbpresent_inline"] = dict(js=[], css=[])

        for asset_type in ["js", "css"]:
            for asset in self.iter_inline_assets(nb, asset_type):
                with open(asset) as src:
                    inline[asset_type].append(src.read())

        return super(PresentExporter, self).from_notebook_node(
            nb,
            resources=resources,
            **kw
        )
