# flake8: noqa

from ._version import __version__, __version_info__
from .exporter import PresentExporter

def load_jupyter_server_extension(nbapp):
    from nbconvert.exporters.export import exporter_map
    exporter_map["nbpresent"] = PresentExporter
