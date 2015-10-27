import os

from nbconvert.exporters.html import HTMLExporter

APP_ROOT = os.path.abspath(os.path.dirname(__file__))


class PresentExporter(HTMLExporter):
    pass
