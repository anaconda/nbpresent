FROM nbpresent_conda_build

RUN cp /home/nbpresent/miniconda/conda-bld/linux-64/nbpresent-0.3.0.dev0-py35_0.tar.bz2 /home/nbpresent

WORKDIR /home/nbpresent

RUN conda create -n npbresent-test-env -y "python<4"

# test install
RUN bash /src/nbpresent/bin/docker_conda_install.sh

# maybe try it
ENTRYPOINT ["tini", "--"]

CMD ["bash", "/src/nbpresent/bin/docker_conda_run.sh"]
