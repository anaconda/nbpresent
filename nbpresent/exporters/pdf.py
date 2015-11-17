import os
from glob import glob
import shutil


try:
    from PySide.QtGui import QApplication, QImage, QPainter, QPrinter
except ImportError as err:
    from PyQt4.QtGui import QApplication, QImage, QPainter, QPrinter
from ghost import Ghost


import tornado.ioloop
import tornado.web


from ipython_genutils.tempdir import TemporaryWorkingDirectory

from .html import PresentExporter
from .pdf_capture import pdf_capture


class PDFPresentExporter(PresentExporter):
    def __init__(self, *args, **kwargs):
        super(PDFPresentExporter, self).__init__(*args, **kwargs)


    def from_notebook_node(self, nb, resources=None, **kw):
        output, resources = super(PDFPresentExporter, self).from_notebook_node(
            nb, resources=resources, **kw
        )

        with TemporaryWorkingDirectory() as td:
            for path, res in resources.get("outputs", {}).items():
                shutil.copyfile(path, os.path.join(td, os.path.basename(path)))

            index_html = os.path.join(td, "index.html")

            with open(index_html, "w+") as f:
                f.write(output)

            pdf_capture(nb, td)
            self.log.info("Building PDF")

            pdf_file = 'notebook.pdf'
            if not os.path.isfile(pdf_file):
                raise IOError("PDF creating failed")
            self.log.info('PDF successfully created')
            with open(pdf_file, 'rb') as f:
                pdf_data = f.read()

        # convert output extension to pdf
        # the writer above required it to be tex
        resources['output_extension'] = '.pdf'
        # clear figure outputs, extracted by latex export,
        # so we don't claim to be a multi-file export.
        resources.pop('outputs', None)

        return pdf_data, resources
