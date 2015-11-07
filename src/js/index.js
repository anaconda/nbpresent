define(["require"],
function(require){
  var ns = "nbpresent-",
    _here = [require.toUrl(".").split("?")[0]],
    here = function(frag){
      return _here.concat(frag).join("/");
    };

  requirejs.config({
    paths: {
      "nbpresent-deps": here(["nbpresent.deps.min"]),
      "nbpresent-notebook": here(["nbpresent.notebook.min"]),
      "nbpresent-standalone": here(["nbpresent.standalone.min"]),
    }
  });

  function init(env){
    requirejs(["nbpresent-deps"], function(){
      requirejs([ns + env], function(Mode){
        new Mode(_here[0]);
      });
    });
  }

  var api = {},
    notebook = api.load_ipython_extension = function(){ init("notebook"); },
    standalone = api.load_presentation_standalone = function(){
      init("standalone");
    };

  if(!window.Jupyter){
    standalone();
  }

  return api;
});
