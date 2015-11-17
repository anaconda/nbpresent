from concurrent import futures
from glob import glob
import os

try:
    from PySide.QtGui import QApplication, QImage, QPainter, QPrinter
except ImportError as err:
    from PyQt4.QtGui import QApplication, QImage, QPainter, QPrinter

from ghost import Ghost


import tornado.web
from tornado.httpserver import HTTPServer

from tornado.ioloop import IOLoop
from tornado.concurrent import run_on_executor

from PyPDF2 import (
    PdfFileReader,
    PdfFileMerger,
)


class CaptureServer(HTTPServer):
    executor = futures.ThreadPoolExecutor(max_workers=1)

    def __init__(self, *args, **kwargs):
        super(CaptureServer, self).__init__(*args, **kwargs)

    @run_on_executor
    def capture(self):
        # DO SOME MAGIC
        ghost = Ghost()
        session = ghost.start()
        session.open("http://localhost:9999/index.html")

        merger = PdfFileMerger()

        # try:
        #     session.wait_for_selector("#nbpresent_present_btn")
        # except Exception as err:
        #     print(err)


        for i, slide in enumerate(self.notebook.metadata.nbpresent.slides):
            filename = "notebook-{0:04d}.pdf".format(i)
            screenshot(self.notebook, session, filename)
            merger.append(PdfFileReader(filename, "rb"))

        out = merger.write("notebook.pdf")

        # while nbpresent.mayAdvance()
        #     screenshot(self.notebook, session)
        IOLoop.instance().stop()


def screenshot(nb, session, dest="notebook.pdf"):
    printer = QPrinter(QPrinter.HighResolution)
    printer.setResolution(600)
    printer.setOutputFileName(dest)
    printer.setPaperSize(QPrinter.A3)
    printer.setOrientation(QPrinter.Landscape)
    printer.setOutputFormat(QPrinter.PdfFormat)

    painter = QPainter(printer)
    painter.scale(10, 10)

    session.main_frame.render(painter)

    painter.end()


def pdf_capture(nb, static_path):
    settings = {
        "static_path": static_path
    }

    app = tornado.web.Application([
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
