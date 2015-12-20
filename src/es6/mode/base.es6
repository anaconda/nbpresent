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
    this.init();
  }
}
