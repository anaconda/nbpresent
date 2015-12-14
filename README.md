
# nbpresent
> remix your Jupyter Notebooks as interactive slideshows

## Installation
```shell
pip install nbpresent
python -m nbpresent.install
```

Then either run 
```python
%reload_ext nbpresent
```

_every time you start the notebook or _enable_ the extension for every notebook launch:
```shell
python -m nbpresent.install --enable
```


### Coming soon
- [conda package](https://github.com/ContinuumIO/nbpresent/issues/1)

## Export
Stock `nbconvert` doesn't store quite enough information, so you'll need to do something like this:
```shell
nbpresent -i notebooks/README.ipynb -o README.html
```
The resulting file can be hosted and viewed (but not edited!) on any site with fallback to Github.

If you have installed [nbbrowserpdf](https://github.com/Anaconda-Server/nbbrowserpdf), you can also export to pdf:
```shell
nbpresent -i notebooks/README.ipynb -f pdf -o README.pdf
```

You can also pass in and get back streams:
```shell
cmd_that_generates_ipynb | nbpresent -f pdf > README.pdf
```

Here's the whole doc:


```python
!nbpresent --help
```

    usage: nbpresent [-h] [-i IPYNB] [-o OUTFILE] [-f {html,zip,pdf}]
    
    Generate a static nbpresent presentation from a Jupyter Notebook
    
    optional arguments:
      -h, --help            show this help message and exit
      -i IPYNB, --ipynb IPYNB
                            Input file (otherwise read from stdin)
      -o OUTFILE, --outfile OUTFILE
                            Output file (otherwise write to stdout)
      -f {html,zip,pdf}, --out-format {html,zip,pdf}
                            Output format


## Development
There are several development scenarios...

### The Hard Way
The `nbpresent` nbextension is built from `src` in a checked out repo with:
- less for style
- babel for es2015
- browserify for packaging

These are installed via `npm`:
```shell
npm install
```

To build everything with sourcemaps:
```shell
npm run build
```

To rebuild on every save:
```shell
npm run watch
```

To build everything, and optimize it:
```shell
npm run build
```

To ensure that you always get the right assets, install the nbextension with the `symlink`, `force` and `enable` options:
```shell
python -m nbpresent.install --overwrite --symlink --enable --user
```

Run the tests
```shell
npm run test
```

Build the conda package
```shell
npm run conda-build
```

### Developing with conda
A conda package, which pre-builds the static assets and installs itself into the local conda environment, is built from `conda.recipe`

```
conda build conda.recipe
```

When developing with conda, you may want to use your conda environment to store assets and configuration:
```shell
python -m nbpresent.install --overwrite --symlink --enable --prefix="${CONDA_ENV_PATH}"
```
