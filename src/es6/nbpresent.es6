import d3 from "d3";
import Baobab from "baobab";

import Jupyter from "base/js/namespace";

import {Presenter} from "./presenter";
import {Sorter} from "./sorter";

class NBPresent {
  constructor() {
    this.tree = new Baobab();
    this.presenter = new Presenter(this.tree);
    this.sorter = new Sorter(this.tree);

    this.initToolbar();
  }

  present() {
    this.presenter.present();
  }

  initToolbar() {
    Jupyter.toolbar.add_buttons_group([{
      label: 'nbpresent',
      icon: 'fa-gift',
      callback: () => this.present(),
      id: 'start_nbpresent'
    }]);
  }
}

var nbpresent = () => {
  let nbp = new NBPresent();
}

export {nbpresent};
