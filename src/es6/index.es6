import {NBPresent} from "./nbpresent";

export function load_ipython_extension(){
  detectRoot(()=> new NBPresent());
}

function detectRoot(cb){
  let local = "nbextensions/nbpresent",
    remote = "https://continuumio.github.io/nbpresent/nbpresent";

  requirejs(
    [`${local}/nbpresent.min`],
    () => initStylesheet(`/${local}`, cb),
    () => initStylesheet(remote, cb)
  );
}

function initStylesheet(root, cb){
  let css = d3.select("head")
    .selectAll("link#nbpresent-css")
    .data([1]);

  if(css.node()){
    console.warn("nbpresent extension already loaded!");
    return;
  }

  css.enter()
    .append("link")
    .attr({id: "nbpresent-css"})
    .attr({
      rel: "stylesheet",
      href: `${root}/nbpresent.min.css`
    });

    cb();
}
