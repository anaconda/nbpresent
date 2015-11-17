import os
import sys

from ..exporters import (
    PDFPresentExporter,
    APP_ROOT
)


def main(nb):
    exp = PDFPresentExporter(
        template_file="nbpresent",
        template_path=[os.path.join(APP_ROOT, "templates")]
    )
    output, resources = exp.from_filename(nb)
    with open("output.pdf", "wb+", ) as f:
        f.write(output)

if __name__ == "__main__":
    main(sys.argv[1])
