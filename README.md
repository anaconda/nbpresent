
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
python -m nbpresent.export -i notebooks/README.ipynb -o README.html
```
The resulting file can be hosted and viewed (but not edited!) on any site with fallback to Github.

If you have installed [nbbrowserpdf](https://github.com/Anaconda-Server/nbbrowserpdf), you can also export to pdf:
```shell
python -m nbpresent.export -i notebooks/README.ipynb -f pdf -o README.pdf
```

You can also pass in and get back streams:
```shell
cmd_that_generates_ipynb | python -m nbpresent.export -f pdf > README.pdf
```

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

### Developing with conda
A conda package, which pre-builds the static assets and installs itself into the local conda environment, is built from `conda.recipe`

```
conda build conda.recipe
```

When developing with conda, you may want to use your conda environment to store assets and configuration:
```shell
python -m nbpresent.install --overwrite --symlink --enable --prefix="${CONDA_ENV_PATH}"
```

### Developing with docker compose
A number of intermediate Dockerfiles are available for different development
workflows. These are most easily managed with docker-compose.

For building a pristine conda environment, use `conda_base`.
For a build of nbpresent, with all tests, use `conda_build`.
For a live, running notebook with nbpresent installed, use `conda`.

>> META: TODO: make templates?

Here is the build chain:

```shell
docker-compose build conda_base && \
docker-compose build conda_build && \
docker-compose build conda && \
docker-compose up conda
```


```python

```
