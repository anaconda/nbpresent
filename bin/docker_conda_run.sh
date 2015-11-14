#!/bin/bash
conda env list
. activate npbresent-test-env
conda env list
env
jupyter notebook --no-browser --ip=* --debug
