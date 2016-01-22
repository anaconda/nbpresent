# coding: utf-8
# flake8: noqa
from ._version import __version__, __version_info__

from nbconvert.exporters.export import exporter_map

from .exporters.html import PresentExporter

PDFPresentExporter = None

pdf_import_error = None

try:
    from .exporters.pdf import PDFPresentExporter
except Exception as err:
    pdf_import_error = err

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
