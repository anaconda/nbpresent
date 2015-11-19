from concurrent import futures
import os
import logging
import time
import sys

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

import nbformat

from PyPDF2 import (
    PdfFileReader,
    PdfFileWriter,
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
            log_level=logging.DEBUG
        )
        session = ghost.start(
            # display=True,
            viewport_size=(1920, 1080),
        )
        merger = PdfFileMerger()
        join = lambda *bits: os.path.join(self.static_path, *bits)

        session.open("http://localhost:9999/index.html")

        try:
            session.wait_for_selector("#nbpresent-css")
            time.sleep(1)
        except Exception as err:
            print(err)

        for i, slide in enumerate(self.notebook.metadata.nbpresent.slides):
            print("\n\n\nprinting slide", i, slide)
            filename = join("notebook-{0:04d}.pdf".format(i))
            session.show()
            screenshot(self.notebook, session, filename)
            merger.append(PdfFileReader(filename, "rb"))
            result, resources = session.evaluate(
                """
                console.log(window.nbpresent);
                console.log(window.nbpresent.mode.presenter.speaker.advance());
                """)
            time.sleep(1)

        merger.write(join("notebook-unmeta.pdf"))

        unmeta = PdfFileReader(join("notebook-unmeta.pdf"), "rb")

        meta = PdfFileWriter()
        meta.appendPagesFromReader(unmeta)

        ipynb = "notebook.ipynb"

        with open(join(ipynb), "rb") as fp:
            meta.addAttachment(ipynb, fp.read())

        with open(join("notebook.pdf"), "wb") as fp:
            meta.write(fp)

        raise KeyboardInterrupt()

def screenshot(nb, session, dest, as_print=False):
    """
    big thanks to https://gist.github.com/jmaupetit/4217925
    """

    printer = QPrinter(mode=QPrinter.ScreenResolution)
    printer.setOutputFormat(QPrinter.PdfFormat)
    printer.setPaperSize(QtCore.QSizeF(1080, 1920), QPrinter.DevicePixel)
    printer.setOrientation(QPrinter.Landscape)
    printer.setOutputFileName(dest)
    printer.setPageMargins(0, 0, 0, 0, QPrinter.DevicePixel)

    if as_print:
        webview = QtWebKit.QWebView()
        webview.setPage(session.page)
        webview.print_(printer)
    else:
        painter = QPainter(printer)
        painter.scale(1.45, 1.45)
        session.main_frame.render(painter)
        painter.end()


def pdf_capture(static_path):
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
    server.static_path = static_path

    with open(os.path.join(static_path, "notebook.ipynb")) as fp:
        server.notebook = nbformat.read(fp, 4)

    ioloop = IOLoop()
    ioloop.add_callback(server.capture)
    server.listen(9999)

    try:
        ioloop.start()
    except KeyboardInterrupt:
        print("stopped")

if __name__ == "__main__":
    pdf_capture(sys.argv[1])
