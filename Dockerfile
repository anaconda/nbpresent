FROM continuumio/miniconda
RUN conda install -yq \
  conda-build==1.19 \
  conda==3.19.1
COPY ./environment.yml /tmp/environment.yml
RUN conda env update --file /tmp/environment.yml \
  && conda env export
COPY . /src/nbpresent
WORKDIR /src/nbpresent
RUN conda build conda.recipe \
    -c anaconda-nb-extensions \
    -c auto \
    -c cpcloud \
    -c javascript \
    -c mutirri
