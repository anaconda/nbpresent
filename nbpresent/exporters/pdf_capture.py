from concurrent import futures
from glob import glob
import os
import logging
import time

from ghost import Ghost
from ghost.bindings import (
    # QApplication,
    # QImage,
    QPainter,
    QPrinter,
    QtWebKit,
    QtCore,
)


import tornado.web
from tornado.httpserver import HTTPServer

from tornado.ioloop import IOLoop
from tornado.concurrent import run_on_executor

from PyPDF2 import (
    PdfFileReader,
    PdfFileMerger,
)

from .base import DEFAULT_STATIC_FILES_PATH


class CaptureServer(HTTPServer):
    executor = futures.ThreadPoolExecutor(max_workers=1)

    def __init__(self, *args, **kwargs):
        super(CaptureServer, self).__init__(*args, **kwargs)

    @run_on_executor
    def capture(self):
        # DO SOME MAGIC
        ghost = Ghost(
            log_level=logging.INFO,
            defaults=dict(
                viewport_size=(1920, 1080),
            )
        )
        session = ghost.start()
        merger = PdfFileMerger()

        session.open("http://localhost:9999/index.html")
        session.wait_for_page_loaded()


        # try:
        #     session.wait_for_selector("#nbpresent-css")
        # except Exception as err:
        #     print(err)

        for i, slide in enumerate(self.notebook.metadata.nbpresent.slides):
            result, resources = session.evaluate(
                """
                console.log(nbpresent);
                """)
            print("printing slide", i, result)
            filename = "notebook-{0:04d}.pdf".format(i)
            screenshot(self.notebook, session, filename)
            # session.print_to_pdf(filename,
            #                      paper_size=(11.0, 8.5))
            merger.append(PdfFileReader(filename, "rb"))
            time.sleep(1)

        out = merger.write("notebook.pdf")

        IOLoop.instance().stop()


def screenshot(nb, session, dest="notebook.pdf", as_print=False):
    """
    big thanks to https://gist.github.com/jmaupetit/4217925
    """
    session.set_viewport_size(1920, 1080)

    printer = QPrinter(mode=QPrinter.ScreenResolution)
    printer.setOutputFormat(QPrinter.PdfFormat)
    printer.setPaperSize(QtCore.QSizeF(8.5, 11), QPrinter.Inch)
    printer.setOrientation(QPrinter.Landscape)
    printer.setOutputFileName(dest)
    printer.setPageMargins(0, 0, 0, 0, QPrinter.Inch)

    if as_print:
        webview = QtWebKit.QWebView()
        webview.setPage(session.page)
        webview.print_(printer)
    else:
        painter = QPainter(printer)
        session.main_frame.render(painter)
        painter.end()


def pdf_capture(nb, static_path):
    settings = {
        "static_path": static_path
    }

    app = tornado.web.Application([
        (r"/components/(.*)", tornado.web.StaticFileHandler, {
            "path": os.path.join(DEFAULT_STATIC_FILES_PATH, "components")
        }),
        (r"/(.*)", tornado.web.StaticFileHandler, {
            "path": settings['static_path']
        }),
    ], **settings)

    server = CaptureServer(app)
    server.notebook = nb

    ioloop = IOLoop.instance()
    ioloop.add_callback(server.capture)
    server.listen(9999)
    ioloop.start()
