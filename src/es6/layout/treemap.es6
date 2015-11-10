import {d3} from "nbpresent-deps";

import {ManualLayout} from "./manual";

export class TreemapLayout extends ManualLayout {
  init(){
    super.init();

    let that = this;

    this.treemap = d3.layout.treemap()
      .size([100, 100])
      .sticky(true)
      .value((d) => {
        return d._value["treemap:weight"] || 1;
      });

    let regions = d3.entries(this.slide.value.regions)
      .map((d) => {
        that.tree.merge([
          "slides",
          that.slide.key,
          "regions",
          d.key
        ], {
          "treemap:weight": d.value["treemap:weight"] || 1
        });
        d._value = d.value;
        return d;
      });

    this.treemap({
      children: regions
    });

    regions.map((d) => {
      that.tree.merge([
        "slides",
        that.slide.key,
        "regions",
        d.key
      ], {
        x: d.x / 100,
        y: d.y / 100,
        width: d.dx / 100,
        height: d.dy / 100
      });
    });
  }
}
