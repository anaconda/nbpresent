FROM nbpresent_conda_build

# Install Tini
USER root
RUN curl -L https://github.com/krallin/tini/releases/download/v0.6.0/tini > tini && \
    echo "d5ed732199c36a1189320e6c4859f0169e950692f451c03e7854243b95f4234b *tini" | sha256sum -c - && \
    mv tini /usr/local/bin/tini && \
    chmod +x /usr/local/bin/tini

USER nbpresent

# test install
WORKDIR /home/nbpresent
RUN conda create -n npbresent-test-env -y "python<4"
RUN bash -c ". activate npbresent-test-env"
RUN conda install -y \
  bokeh \
  ipywidgets \
  notebook \
  terminado

RUN conda install -y \
  /home/nbpresent/miniconda/conda-bld/linux-64/nbpresent-0.3.0.dev0-py35_0.tar.bz2
RUN cp /home/nbpresent/miniconda/conda-bld/linux-64/nbpresent-0.3.0.dev0-py35_0.tar.bz2 /home/nbpresent

# maybe try it
ENTRYPOINT ["tini", "--"]
CMD ["jupyter", "notebook", "--ip=*", "--no-browser"]
