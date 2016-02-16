import {d3} from "nbpresent-deps";

import {StandalonePresenter} from "../presenter/standalone";

import {BaseMode} from "./base";

export class StandaloneMode extends BaseMode {
  init() {
    super.init();

    this.presenter = new StandalonePresenter(this.tree);

    this.presenter.presenting.set(true);

    return this;
  }

  metadata() {
    let tree = JSON.parse(d3.select("#nbpresent_tree").text());

    // TODO: centralize serialized keys
    return {
      slides: tree.slides || {},
      themes: tree.themes || {},
      root: this.root
    };
  }
}
