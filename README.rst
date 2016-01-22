
nbpresent
=========

    remix your Jupyter Notebooks as interactive slideshows

Installation
------------

.. code:: shell

    pip install nbpresent
    python -m nbpresent.install

Then either run

.. code:: python

    %reload_ext nbpresent

*every time you start the notebook* or *enable* the extension for every
notebook launch:

.. code:: shell

    python -m nbpresent.install --enable

Export
------

Stock ``nbconvert`` doesn't store quite enough information, so you'll
need to do something like this:

.. code:: shell

    nbpresent -i notebooks/README.ipynb -o README.html

The resulting file can be hosted and viewed (but not edited!) on any
site with fallback to Github.

If you have installed
`nbbrowserpdf <https://github.com/Anaconda-Server/nbbrowserpdf>`__, you
can also export to pdf:

.. code:: shell

    nbpresent -i notebooks/README.ipynb -f pdf -o README.pdf

You can also pass in and get back streams:

.. code:: shell

    cmd_that_generates_ipynb | nbpresent -f pdf > README.pdf

Here's the whole doc:

.. code:: python

    !nbpresent --help


.. parsed-literal::

    usage: nbpresent [-h] [-i IPYNB] [-o OUTFILE] [-f {html,pdf}]
    
    Generate a static nbpresent presentation from a Jupyter Notebook
    
    optional arguments:
      -h, --help            show this help message and exit
      -i IPYNB, --ipynb IPYNB
                            Input file (otherwise read from stdin)
      -o OUTFILE, --outfile OUTFILE
                            Output file (otherwise write to stdout)
      -f {html,pdf}, --out-format {html,pdf}
                            Output format


Development
-----------

This assumes you have cloned this repository locally:

::

    git clone https://github.com/Anaconda-Server/nbpresent.git
    cd nbpresent

Repo Architecture
~~~~~~~~~~~~~~~~~

The ``nbpresent`` nbextension is built from ``./src`` into
``./nbpresent/static/nbresent`` with: - ``less`` for style - ``es6``
(via ``babel``) for javascript - ``browserify`` for packaging

The ``nbpresent`` python module (server component) is stored in the
``/nbpresent`` folder

Getting Started
~~~~~~~~~~~~~~~

You'll need conda installed, either from
`Anaconda <https://www.continuum.io/downloads>`__ or
`miniconda <http://conda.pydata.org/miniconda.html>`__. You can import a
Python 3.5 development environment named ``nbpresent`` from
``./environment.yml``.

.. code:: shell

    conda update env
    source activate nbpresent

We *still* use ``npm`` for a lot of dependencies, so then run:

.. code:: shell

    npm install
    npm run build:all

Ensure development asset loading
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To ensure that you always get the right assets, install the nbextension
with the ``symlink``, ``force`` and ``enable`` options:

.. code:: shell

    python -m nbpresent.install --overwrite --symlink --enable --user

You may also want to pass in ``--prefix`` instead of user.

Chore Automation
~~~~~~~~~~~~~~~~

+---------+------------+
| Task    | Command    |
+=========+============+
| Build   | ``npm run  |
| all of  | build``    |
| the     |            |
| front   |            |
| end     |            |
| assets  |            |
| with    |            |
| sourcem |            |
| aps     |            |
| for     |            |
| develop |            |
| ment    |            |
+---------+------------+
| Rebuild | ``npm run  |
| on      | watch``    |
| every   |            |
| save    |            |
+---------+------------+
| Rebuild | ``npm run  |
| all of  | dist``     |
| the     |            |
| front   |            |
| end     |            |
| assets, |            |
| and     |            |
| optimiz |            |
| e       |            |
| it      |            |
+---------+------------+
| Run the | ``npm run  |
| CasperJ | test``     |
| S       |            |
| and     |            |
| ``nose` |            |
| `       |            |
| tests   |            |
+---------+------------+
| Check   | ``npm run  |
| code    | lint``     |
| style   |            |
+---------+------------+
| Build   | ``npm run  |
| the     | pkg:conda` |
| conda   | `          |
| package |            |
+---------+------------+
| Build   | ``npm run  |
| and     | pkg:pypi`` |
| upload  |            |
| the     |            |
| pypi    |            |
| package |            |
+---------+------------+
| Build   | ``npm run  |
| the     | docs``     |
| ESDoc   |            |
| and     |            |
| Sphinx  |            |
| documen |            |
| tation  |            |
+---------+------------+
