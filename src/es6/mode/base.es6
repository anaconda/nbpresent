import {d3} from "nbpresent-deps";

import {Tree} from "../tree";


/** Make a new Editor. The base app, as created in `index.html` */
export class BaseMode {
  /** Make a new Editor.
    * @param {baobab.Cursor} slide - the slide to edit */
  constructor(root){
    this.root = root;

    this.tree = new Tree({
      slides: this.metadata().slides,
      theme: this.metadata().theme,
      root: this.root
    }).tree;

    this.slides = this.tree.select(["slides"]);

    this.theme = this.tree.select(["theme"]);

    this.init();
  }

  init(){
    return this;
  }
}
