# coding: utf-8
# flake8: noqa
import os

from nbconvert.exporters.export import exporter_map

from ._version import __version__, __version_info__
from .exporters.html import PresentExporter

PDFPresentExporter = None
pdf_import_error = None

try:
    from .exporters.pdf import PDFPresentExporter
except Exception as err:
    pdf_import_error = err


# Jupyter Extension points
def _jupyter_nbextension_paths():
    return [dict(
        section="notebook",
        src=os.path.join("static", "nbpresent"),
        dest="nbpresent",
        require="nbpresent/js/nbpresent.min")]


def _jupyter_server_extension_paths():
    return [dict(module="nbpresent")]


def load_jupyter_server_extension(nbapp):
    nbapp.log.info("✓ nbpresent HTML export ENABLED")
    exporter_map.update(
        nbpresent=PresentExporter,
    )

    if pdf_import_error:
        nbapp.log.warn(
            "✗ nbpresent PDF export DISABLED: {}"
            .format(pdf_import_error)
        )
    else:
        nbapp.log.info("✓ nbpresent PDF export ENABLED")
        exporter_map.update(
            nbpresent_pdf=PDFPresentExporter
        )
