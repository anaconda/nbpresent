import {d3} from "nbpresent-deps";

import {Tree} from "../tree";
import {Presenter} from "../presenter/standalone";

import {Mode} from "./base";


export default class StandaloneMode extends Mode {
  init() {
    let slides = JSON.parse(d3.select("#nbpresent_tree").text()),
      tree = new Tree({
        slides: slides.slides,
        root: this.root
      }),
      presenter = new Presenter(tree.tree);

    presenter.presenting.set(true);
  }
}
