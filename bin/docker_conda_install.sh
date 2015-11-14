#!/bin/bash
# foo
conda env list
. activate npbresent-test-env
conda env list

conda install -y \
  bokeh \
  ipywidgets \
  notebook \
  terminado

conda install -y \
/home/nbpresent/miniconda/conda-bld/linux-64/nbpresent-0.3.0.dev0-py35_0.tar.bz2
