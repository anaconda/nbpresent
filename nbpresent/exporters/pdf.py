import os
import shutil
import sys
from subprocess import check_call

from ipython_genutils.tempdir import TemporaryWorkingDirectory
import nbformat

from .html import PresentExporter


class PDFPresentExporter(PresentExporter):
    def __init__(self, *args, **kwargs):
        super(PDFPresentExporter, self).__init__(*args, **kwargs)

    def from_notebook_node(self, nb, resources=None, **kw):
        output, resources = super(PDFPresentExporter, self).from_notebook_node(
            nb, resources=resources, **kw
        )

        with TemporaryWorkingDirectory() as td:
            for path, res in resources.get("outputs", {}).items():
                dest = os.path.join(td, os.path.basename(path))
                shutil.copyfile(path, dest)

            index_html = os.path.join(td, "index.html")

            with open(index_html, "w+") as fp:
                fp.write(output)

            ipynb = "notebook.ipynb"

            with open(os.path.join(td, ipynb), "w") as fp:
                nbformat.write(nb, fp)

            self.log.info("Building PDF...")
            check_call([
                sys.executable,
                "-m", "nbpresent.exporters.pdf_capture",
                td
            ])

            pdf_file = "notebook.pdf"

            if not os.path.isfile(pdf_file):
                raise IOError("PDF creating failed")

            self.log.info("PDF successfully created")

            with open(pdf_file, 'rb') as f:
                pdf_data = f.read()

        # convert output extension to pdf
        # the writer above required it to be tex
        resources['output_extension'] = '.pdf'
        # clear figure outputs, extracted by latex export,
        # so we don't claim to be a multi-file export.
        resources.pop('outputs', None)

        return pdf_data, resources
