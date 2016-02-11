import time

from ghost.bindings import (
    QPainter,
    QPrinter,
    QtCore,
)

from PyPDF2 import (
    PdfFileReader,
    PdfFileMerger,
)

from nbbrowserpdf.exporters.pdf_ghost import NotebookPDFGhost, parser


# a notional default viewport...
VIEWPORT = (1920, 1080)


class PresentationPDFGhost(NotebookPDFGhost):
    embed_ipynb = True

    def print_to_pdf(self, path):
        """ Custom print based on metadata: generate one per slide
        """
        merger = PdfFileMerger()

        for i, slide in enumerate(self.notebook.metadata.nbpresent.slides):
            print("\n\n\nprinting slide", i, slide)
            # science help you if you have 9999 slides
            filename = self.in_static("notebook-{0:04d}.pdf".format(i))
            # this is weird, but it seems to always need it
            self.session.show()
            self.screenshot(filename)
            merger.append(PdfFileReader(filename, "rb"))

            # advance the slides
            result, resources = self.session.evaluate(
                """
                console.log(window.nbpresent);
                console.log(window.nbpresent.mode.presenter.speaker.advance());
                """)

            # always seem to get some weirdness... perhaps could inttegrate
            # ioloop...
            time.sleep(1)

        # all done!
        merger.write(path)

    def screenshot(self, filename):
        """ do an individual slide screenshot
            big thanks to https://gist.github.com/jmaupetit/4217925
        """

        printer = QPrinter(mode=QPrinter.ScreenResolution)
        printer.setOutputFormat(QPrinter.PdfFormat)
        printer.setPaperSize(QtCore.QSizeF(*reversed(VIEWPORT)),
                             QPrinter.DevicePixel)
        printer.setOrientation(QPrinter.Landscape)
        printer.setOutputFileName(filename)
        printer.setPageMargins(0, 0, 0, 0, QPrinter.DevicePixel)

        painter = QPainter(printer)
        painter.scale(1.45, 1.45)
        self.session.main_frame.render(painter)
        painter.end()


def main(url, static_path):
    pdf_ghost = PresentationPDFGhost(url, static_path)

    pdf_ghost.render()


if __name__ == "__main__":
    main(**parser.parse_args().__dict__)
