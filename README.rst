
nbpresent
=========

    remix your Jupyter Notebooks as interactive slideshows

.. figure:: http://continuumio.github.io/nbpresent/nbpresent.gif
   :alt: example movie

   example movie

Installation
------------

.. code:: shell

    pip install nbpresent
    python -m nbpresent.install

To also *enable* the extension for every notebook launch:

.. code:: shell

    python -m nbpresent.install --enable

Coming soon
~~~~~~~~~~~

-  `conda package <https://github.com/ContinuumIO/nbpresent/issues/1>`__

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
