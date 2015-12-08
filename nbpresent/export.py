from argparse import ArgumentParser
import os
import sys

from .exporters import (
    APP_ROOT
)


def export(ipynb=None, outfile=None, out_format=None, verbose=None):
    if out_format in ["pdf"]:
        from .exporters.pdf import PDFPresentExporter as Exporter
    elif out_format in ["html"]:
        from .exporters.html import PresentExporter as Exporter
    elif out_format in ["zip"]:
        raise NotImplemented("zip output like the browser app coming soon")

    exp = Exporter(
        template_file="nbpresent",
        template_path=[os.path.join(APP_ROOT, "templates")]
    )
    if ipynb is not None:
        output, resources = exp.from_filename(ipynb)
    else:
        output, resources = exp.from_file(sys.stdin)

    mode, stream = (["wb+", sys.stdout.buffer]
                    if out_format in ["pdf", "zip"]
                    else ["w+", sys.stdout])
    if outfile is not None:
        with open(outfile, mode) as f:
            f.write(output)
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
        choices=["html", "zip", "pdf"],
        help="Output format"
    )

    export(**parser.parse_args().__dict__)


if __name__ == "__main__":
    main()
