define(["require"],
function(require){
  var ns = "nbpresent-",
    _here = [require.toUrl(".").split("?")[0]],
    here = function(frag){
      return _here.concat(frag).join("/")
        .replace("//", "/");
    };

  requirejs.config({
    paths: {
      "nbpresent-deps": here(["nbpresent.deps.min"]),
      "nbpresent-notebook": here(["nbpresent.notebook.min"]),
      "nbpresent-standalone": here(["nbpresent.standalone.min"]),
    }
  });

  function init(env){
    console.error(">>>nbpresent init started\n\n" + [requirejs] + "<<<require\n\n");
    requirejs(["require", ns + "deps"], function(require, deps){
      console.error(">>>nbpresent DEPS loaded", [deps]);
      requirejs(["require", ns + env], function(require, Mode){
        console.error(">>>nbpresent LOADER loaded", [Mode]);
        try {
          window.nbpresent = new Mode(_here[0].replace("./", "."));
          console.error(">>>nbpresent LOADER initialized", deps);
        } catch(err) {
          console.error(">>>nbpresent FAILED\n\n", err);
          window.nbpresent = err;
        }
      });
    });
  }

  return {
    load_ipython_extension: function(){ init("notebook"); },
    load_presentation_standalone: function(){ init("standalone"); }
  };
});
