
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
python -m nbpresent.present notebooks/README.ipynb > README.html
```
The resulting file can be hosted and viewed (but not edited!) on any site with fallback to Github.

## Development
The `nbpresent` nbextension is built from `src` with:
- less for style
- babel for es2015
- browserify for packaging

These are installed via `npm`:
```shell
npm install
```

To build everything:
```shell
npm run build
```

To rebuild on every save:
```shell
npm run watch
```

To ensure that you always get the right assets, install the nbextension with the `symlink`, `force` and `enable` options:
```shell
python -m nbpresent.install --override --symlink --enable
```

### Developing with conda

### Developing with docker compose
A number of intermediate Dockerfiles are available for different development
workflows. These are most easily managed with docker-compose.

For building a pristine conda environment, use `conda_base`.
For a build of nbpresent, with all tests, use `conda_build`.
For a live, running notebook with nbpresent installed, use `conda`.

>> META: TODO: make templates?

Here is the build chain:

```shell
docker-compose build conda_base
docker-compose build conda_build
docker-compose build conda
docker-compose up conda
```
