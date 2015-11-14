FROM nbpresent_conda_build

# test install
WORKDIR /home/nbpresent

RUN conda create -n npbresent-test-env -y "python<4"
RUN . activate npbresent-test-env
RUN conda env list && \
  conda install -y \
    bokeh \
    ipywidgets \
    notebook \
    terminado &&\
  conda install -y \
  /home/nbpresent/miniconda/conda-bld/linux-64/nbpresent-0.3.0.dev0-py35_0.tar.bz2
RUN cp /home/nbpresent/miniconda/conda-bld/linux-64/nbpresent-0.3.0.dev0-py35_0.tar.bz2 /home/nbpresent

# maybe try it
ENTRYPOINT ["tini", "--"]
CMD ["jupyter", "notebook", "--ip=*", "--no-browser"]
