
# nbpresent
> remix your Jupyter Notebooks as interactive slideshows

![example movie](http://continuumio.github.io/nbpresent/nbpresent.gif)

## Installation
```shell
pip install nbpresent
python -m nbpresent.install
```

To also _enable_ the extension for every notebook launch:
```shell
python -m nbpresent.install --enable
```

### Coming soon
- [conda package](https://github.com/ContinuumIO/nbpresent/issues/1)

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
python -m nbpresent.install --force --symlink --enable
```
