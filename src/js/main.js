require(

["jquery", "nbpresent-deps", "nbpresent-standalone"],

function(jquery, deps, mode){
  $(function(){
    window.nbpresent = new mode.StandaloneMode("./");
  });
});
