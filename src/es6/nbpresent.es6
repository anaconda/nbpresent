import d3 from "d3";
import Baobab from "baobab";

import Jupyter from "base/js/namespace";

import {Presenter} from "./presenter";
import {Sorter} from "./sorter";

class NBPresent {
  constructor() {
    this.tree = new Baobab({
      slides: {}
    });
    this.presenter = new Presenter(this.tree);
    this.sorter = new Sorter(this.tree);

    this.initToolbar();
    this.initStylesheet();
  }

  initStylesheet() {
    d3.select("head")
      .selectAll("link#nbpresent-css")
      .data([1])
    .enter()
      .append("link")
      .attr({
        rel: "stylesheet",
        // TODO: figure out how to make this portable
        href: "/nbextensions/nbpresent/nbpresent.min.css"
      });
  }

  initToolbar() {
    Jupyter.toolbar.add_buttons_group([{
      label: 'nbpresent',
      icon: 'fa-gift',
      callback: () => this.sorter.show(),
      id: 'start_nbpresent'
    }]);
  }
}

var nbpresent = () => {
  let nbp = new NBPresent();
}

export {nbpresent};
