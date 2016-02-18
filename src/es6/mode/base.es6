import {Tree} from "../tree";
import {log} from "../logger";

/** Make a new Editor. The base app, as created in `index.html` */
export class BaseMode {
  /** Make a new Editor.
    * @param {baobab.Cursor} slide - the slide to edit */
  constructor(root){
    this.root = root;

    this.tree = new Tree({
      slides: this.metadata().slides,
      themes: this.metadata().themes,
      root: this.root
    }).tree;

    this.slides = this.tree.select(["slides"]);

    this.themes = this.tree.select(["themes"]);

    this.log = log;

    this.init();
  }

  init(){
    return this;
  }
}
