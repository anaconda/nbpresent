FROM andrewosh/binder-base

USER main

RUN conda install -y -c nbcio -n python3 nbpresent 
