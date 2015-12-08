FROM andrewosh/binder-base

USER main

RUN git clone https://github.com/Anaconda-Server/nbpresent.git

WORKDIR nbpresent

# conda packages (preferred)
RUN conda install \
    -y \
    -c javascript \
    -c nbcio \
    bokeh \
    bqplot \
    nbbrowserpdf \
    nodejs \
  && conda env export

RUN pip install \
  --no-cache-dir \
  qgrid

RUN npm install && npm run dist
RUN python setup.py develop
RUN jupyter nbextension install \
  --prefix="${CONDA_ENV_PATH}" \
  nbpresent/static/nbpresent
