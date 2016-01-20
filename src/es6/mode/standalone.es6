import {d3, $} from "nbpresent-deps";

import {Tree} from "../tree";
import {StandalonePresenter} from "../presenter/standalone";

import {Mode as BaseMode} from "./base";

export class Mode extends BaseMode {
  init() {
    let slides = JSON.parse(d3.select("#nbpresent_tree").text());

    let tree = new Tree({
      slides: slides.slides,
      root: this.root
    });

    this.tree = tree.tree;

    this.presenter = new StandalonePresenter(this.tree);

    this.presenter.presenting.set(true);
  }
}
