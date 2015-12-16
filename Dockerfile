FROM andrewosh/binder-base

USER main

RUN /bin/bash -c "source activate python3 \
  && conda install \
    -y \
    -c nbcio \
    nbpresent \
    notebook \
  && pip install \
    --no-cache-dir \
    bqplot \
    qgrid \
  && conda env export"
