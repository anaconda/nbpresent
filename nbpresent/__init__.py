# flake8: noqa
from ._version import __version__, __version_info__


def load_jupyter_server_extension(nbapp):
    from nbconvert.exporters.export import exporter_map
    from .exporters.html import PresentExporter

    nbapp.log.info("Enabling nbpresent HTML export")
    exporter_map.update(
        nbpresent=PresentExporter,
    )

    try:
        from .exporters.pdf import PDFPresentExporter
    except Exception as err:
        nbapp.log.warn(
            "nbbrowserpdf not available, PDF generation disabled: {}"
            .format(err)
        )
        return

    nbapp.log.info("Enabling nbpresent PDF export")
    exporter_map.update(
        nbpresent_pdf=PDFPresentExporter
    )
