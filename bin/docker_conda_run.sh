#!/bin/bash
env
conda env list
. activate npbresent-test-env
conda env list
jupyter notebook --no-browser --ip=*
