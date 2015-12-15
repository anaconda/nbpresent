#!/usr/bin/env python
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.intersphinx',
    'sphinx.ext.todo',
    'sphinx.ext.coverage',
    'sphinx.ext.viewcode',
]

templates_path = ['_templates']
source_suffix = '.rst'
master_doc = 'index'
project = 'nbpresent'
copyright = '2015, Nicholas Bollweg'
author = 'Nicholas Bollweg'
version = '0.4.1'
release = '0.4.1'
language = None
exclude_patterns = []
pygments_style = 'sphinx'
todo_include_todos = True
html_theme = 'alabaster'
html_static_path = ['_static']
htmlhelp_basename = 'nbpresentdoc'
latex_elements = {}
latex_documents = [
    (master_doc, 'nbpresent.tex', 'nbpresent Documentation',
     'Nicholas Bollweg', 'manual'),
]
man_pages = [(master_doc, 'nbpresent', 'nbpresent Documentation', [author], 1)]
texinfo_documents = [
    (master_doc, 'nbpresent', 'nbpresent Documentation', author, 'nbpresent',
     'One line description of project.', 'Miscellaneous'),
]
intersphinx_mapping = {'https://docs.python.org/': None}
