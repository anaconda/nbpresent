from nbbrowserpdf.exporters.pdf_capture import CaptureServer

VIEWPORT = (1920, 1080)


class SlideCaptureServer(CaptureServer):
    """ CaptureServer to generate multi-page PDF based on nbpresent metadata
    """
    ghost_cmd = "nbpresent.exporters.pdf_ghost"
