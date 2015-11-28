import os
import sys

from ..exporters import (
    APP_ROOT
)
from ..exporters.html import PresentExporter


def main(nb):
    exp = PresentExporter(
        template_file="nbpresent",
        template_path=[os.path.join(APP_ROOT, "templates")]
    )
    output, resources = exp.from_filename(nb)
    print(output)

if __name__ == "__main__":
    main(sys.argv[1])
