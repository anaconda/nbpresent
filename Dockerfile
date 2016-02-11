FROM continuumio/miniconda
RUN conda install -yq \
  conda-build==1.19 \
  conda==3.19.1
COPY ./environment.yml /tmp/environment.yml
RUN conda env update --file /tmp/environment.yml
RUN mkdir -p /opt/conda/conda-bld/linux-64/
COPY . /src/nbpresent
WORKDIR /src/nbpresent
RUN conda build \
    conda.recipe \
    -c anaconda-nb-extensions \
    -c auto \
    -c bokeh \
    -c cpcloud \
    -c javascript \
    -c mutirri \
    -c wakari
