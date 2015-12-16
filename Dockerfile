FROM andrewosh/binder-base

USER main

RUN source activate python3 \
  && conda install \
    -y \
    -c nbcio \
    nbpresent \
  && pip install \
    --no-cache-dir \
    bqplot \
    qgrid \
  && conda env export
