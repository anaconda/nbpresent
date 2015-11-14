# flake8: noqa
from ._version import __version__, __version_info__


def load_jupyter_server_extension(nbapp):
    from notebook.services.config import ConfigManager
    from nbconvert.exporters.export import exporter_map
    from .exporter import PresentExporter

    cm = ConfigManager()
    cm.update('notebook',
              {"load_extensions": {"nbpresent/nbpresent.min": True}})

    exporter_map["nbpresent"] = PresentExporter
