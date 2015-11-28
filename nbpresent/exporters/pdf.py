from .html import PresentExporter

from nbbrowserpdf.exporters.pdf import BrowserPDFExporter


class PDFPresentExporter(PresentExporter, BrowserPDFExporter):
    def pdf_capture_args(self):
        return [
            "--capture-server-class",
            "nbpresent.exporters.pdf_capture:SlideCaptureServer"
        ]
