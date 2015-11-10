import {d3} from "nbpresent-deps";

import {ManualLayout} from "./manual";

export class TreemapLayout extends ManualLayout {
  constructor(slide){
    super(slide);

    this.treemap = d3.layout.treemap()
      .size([width, height])
      .sticky(true)
      .value(({weight}) => weight);
  }
}
