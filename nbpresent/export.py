from argparse import ArgumentParser
import codecs
import os
import sys

from .exporters import (
    APP_ROOT
)

BINARY_FORMATS = ["pdf"]


def export(ipynb=None, outfile=None, out_format=None, verbose=None):
    if out_format in ["pdf"]:
        from .exporters.pdf import PDFPresentExporter as Exporter
    elif out_format in ["html"]:
        from .exporters.html import PresentExporter as Exporter

    exp = Exporter(
        template_file="nbpresent",
        template_path=[os.path.join(APP_ROOT, "templates")]
    )
    if ipynb is not None:
        output, resources = exp.from_filename(ipynb)
    else:
        output, resources = exp.from_file(sys.stdin)

    mode, stream = (["wb+", sys.stdout.buffer]
                    if out_format in BINARY_FORMATS
                    else ["w+", sys.stdout])

    if outfile is not None:
        if out_format in BINARY_FORMATS:
            with open(outfile, mode) as fp:
                fp.write(output)
        else:
            with codecs.open(outfile, mode, encoding="utf-8") as fp:
                fp.write(output)
    else:
        stream.write(output)


def main():
    parser = ArgumentParser(
        description="Generate a static nbpresent presentation from a Jupyter"
                    " Notebook")
    parser.add_argument(
        "-i", "--ipynb",
        help="Input file (otherwise read from stdin)")
    parser.add_argument(
        "-o", "--outfile",
        help="Output file (otherwise write to stdout)")
    parser.add_argument(
        "-f", "--out-format",
        default="html",
        choices=["html", "pdf"],
        help="Output format"
    )

    export(**parser.parse_args().__dict__)


if __name__ == "__main__":
    main()
