# flake8: noqa
from ._version import __version__, __version_info__


def load_jupyter_server_extension(nbapp):
    from nbconvert.exporters.export import exporter_map
    from .exporter import PresentExporter
    exporter_map["nbpresent"] = PresentExporter
