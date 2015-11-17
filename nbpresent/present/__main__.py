import os
import sys

from ..exporters import (
    PresentExporter,
    APP_ROOT
)


def main(nb):
    exp = PresentExporter(
        template_file="nbpresent",
        template_path=[os.path.join(APP_ROOT, "templates")]
    )
    output, resources = exp.from_filename(nb)
    print(output)

if __name__ == "__main__":
    main(sys.argv[1])
