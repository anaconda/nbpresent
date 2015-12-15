define(["require"],
function(require){
  var ns = "nbpresent-",
    _here = [require.toUrl(".").split("?")[0]],
    here = function(frag){
      var path = _here.concat(frag).join("/")
        .replace("//", "/")
        .replace("/./.", "/")
      return path;
    };

  requirejs.config({
    paths: {
      "nbpresent-deps": [
        here(["nbpresent.deps.min"]),
        "./nbpresent/nbpresent.deps.min"
      ],
      "nbpresent-notebook": here(["nbpresent.notebook.min"]),
      "nbpresent-standalone": [
        here(["nbpresent.standalone.min"]),
        "nbpresent/nbpresent.standalone.min"
      ]
    }
  });

  function init(env){
    var nbpresent = window.nbpresent = {loading: true};
    requirejs(["require", ns + "deps"], function(require, deps){
      nbpresent.deps = deps;
      requirejs(["require", ns + env], function(require, mode){
        nbpresent.Mode = mode.Mode;
        window.nbpresent.mode = new mode.Mode(_here[0].replace("./", "."));
      });
    });
  }

  return {
    load_ipython_extension: function(){ init("notebook"); },
    load_presentation_standalone: function(){ init("standalone"); }
  };
});
