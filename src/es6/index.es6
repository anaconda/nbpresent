export function load_ipython_extension(){
  requirejs.config({
    paths: {
      "nbpresent-deps": "/nbextensions/nbpresent/nbpresent.deps.min",
      "nbpresent-loader": "/nbextensions/nbpresent/nbpresent.loader.min",
    }
  });

  requirejs(["nbpresent-deps"],
    (deps) => requirejs(["nbpresent-loader"],
      (loader) => loader.load()
    )
  )
}
