import {VanillaSlab, uuid} from "nbpresent-deps";

import {BaseStyle} from "./base";

export class SlabStyle extends BaseStyle {
  update(part) {
    this.slab = new VanillaSlab();
    let key = "data-nbpresent-slab-id";

    if(part.attr(key)){
      return;
    }

    let dataId = uuid.v4();

    part.attr(key, dataId);

    this.slab.init({
      selector: `[data-nbpresent-slab-id="${dataId}"] h1`
    });
  }
}
