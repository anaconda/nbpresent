
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

\_every time you start the notebook or *enable* the extension for every
notebook launch:

.. code:: shell

    python -m nbpresent.install --enable

Coming soon
~~~~~~~~~~~

-  `conda package <https://github.com/ContinuumIO/nbpresent/issues/1>`__

Export
------

Stock ``nbconvert`` doesn't store quite enough information, so you'll
need to do something like this:

.. code:: shell

    python -m nbpresent.present notebooks/README.ipynb > README.html

The resulting file can be hosted and viewed (but not edited!) on any
site with fallback to Github.

Development
-----------

The ``nbpresent`` nbextension is built from ``src`` with: - less for
style - babel for es2015 - browserify for packaging

These are installed via ``npm``:

.. code:: shell

    npm install

To build everything:

.. code:: shell

    npm run build

To rebuild on every save:

.. code:: shell

    npm run watch

To ensure that you always get the right assets, install the nbextension
with the ``symlink``, ``force`` and ``enable`` options:

.. code:: shell

    python -m nbpresent.install --force --symlink --enable
