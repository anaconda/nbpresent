import {d3, $} from "nbpresent-deps";

import {StandalonePresenter} from "../presenter/standalone";

import {BaseMode} from "./base";

export class StandaloneMode extends BaseMode {
  init() {
    super.init();

    this.presenter = new StandalonePresenter(this.tree);

    this.presenter.presenting.set(true);
  }

  loadData() {
    let slides = JSON.parse(d3.select("#nbpresent_tree").text());

    return {
      slides: slides.slides,
      root: this.root
    };
  }
}
