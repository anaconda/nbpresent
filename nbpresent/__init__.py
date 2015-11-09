# flake8: noqa
from nbconvert.exporters.export import exporter_map

from ._version import __version__, __version_info__
from .exporter import PresentExporter

def load_jupyter_server_extension(nbapp):
    exporter_map["nbpresent"] = PresentExporter
