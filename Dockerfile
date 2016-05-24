FROM continuumio/miniconda

RUN apt-get install -y libfreetype6-dev libfontconfig1-dev

RUN conda install -yq \
  conda-build>=1.20.3 \
  conda>=4.0.6

COPY ./environment.yml /tmp/environment.yml
RUN conda env update --file /tmp/environment.yml

RUN mkdir -p /opt/conda/conda-bld/linux-64/

COPY . /src/nbpresent

WORKDIR /src/nbpresent

RUN conda build conda.recipe -c=conda-forge --python=2.7
RUN conda build conda.recipe -c=conda-forge --python=3.4
RUN conda build conda.recipe -c=conda-forge --python=3.5

CMD ["/bin/bash"]
