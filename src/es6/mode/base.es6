import {d3} from "nbpresent-deps";

import {Tree} from "../tree";


/** Make a new Editor. The base app, as created in `index.html` */
export class BaseMode {
  /** Make a new Editor.
    * @param {baobab.Cursor} slide - the slide to edit */
  constructor(root){
    /** the metadata root of a running nbpresent mode
      * @type {baobab.Cursor} */
    this.root = root;

    this.initStylesheet()
      .init();
  }

  /** initialize the data state and UI relationships
    * @return {BaseMode} */
  init() {
    this.tree = new Tree(this.loadData()).tree;
  }

  loadData() {
    return {
      slides: {},
      root: ""
    }
  }



  /** ensure that the correct style asset has been loaded
    * @return {BaseMode} */
  initStylesheet(){
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
        href: `${this.root}/nbpresent.min.css`
      });

    return this;
  }
}
