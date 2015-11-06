requirejs.config({
  paths: {
    "nbpresent-deps": [
      "/nbextensions/nbpresent/nbpresent.deps.min",
      "/nbpresent/static/nbpresent/nbpresent.deps.min"
    ],
    "nbpresent-loader": [
      "/nbextensions/nbpresent/nbpresent.loader.min",
      "/nbpresent/static/nbpresent/nbpresent.loader.min"
    ],
    "nbpresent-runtime": [
      "/nbextensions/nbpresent/nbpresent.runtime.min",
      "/nbpresent/static/nbpresent/nbpresent.runtime.min"
    ],
  }
});

export function load_ipython_extension(){
  requirejs(["nbpresent-deps"],
    (deps) => requirejs(["nbpresent-loader"],
      (loader) => loader.load()
    )
  );
}

export function load_presentation_runtime(){
  requirejs(["nbpresent-deps"], () => {
    requirejs(["nbpresent-runtime"], ({start}) => {
      start();
    })
  });
}

if(!window.Jupyter){
  load_presentation_runtime();
}
