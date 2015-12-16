FROM andrewosh/binder-base

USER main

RUN conda install \
    -y \
    -c nbcio \
    nbpresent \
    notebook

RUN pip install \
    --no-cache-dir \
    bqplot \
    qgrid \
  && conda env export
