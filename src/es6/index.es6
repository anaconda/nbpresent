import {NBPresent} from "./nbpresent";

export function load_ipython_extension(){
  console.info("nbpresent extension loaded");
  detectRoot();
  return new NBPresent();
}

function detectRoot(){
  let local = "/nbextensions/nbpresent",
    remote = "https://continuumio.github.io/nbpresent/nbpresent";

  requirejs(
    [`${local}/nbpresent.min.js`],
    () => initStylesheet(local),
    () => initStylesheet(remote)
  );
}

function initStylesheet(root){
  console.info(`using nbpresent assets from ${root}`)
  d3.select("head")
    .selectAll("link#nbpresent-css")
    .data([1])
  .enter()
    .append("link")
    .attr({id: "nbpresent-css"})
    .attr({
      rel: "stylesheet",
      href: `${root}/nbpresent.min.css`
    });
}
