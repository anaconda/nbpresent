import {d3} from "nbpresent-deps";

import {ManualLayout} from "./manual";

let KEY = "treemap",
  WEIGHT = "treemap:weight";

export class TreemapLayout extends ManualLayout {
  static clsKey(){
    return KEY;
  }

  attrDefaults() {
    var attrs = {};
    attrs[WEIGHT] = 1.0;
    return attrs;
  }

  key(){
    return KEY;
  }

  init(){
    super.init();

    let that = this;

    this.treemap = d3.layout.treemap()
      .size([100, 100])
      .sticky(true)
      .value((d) => {
        return (d._value || {}).attrs[WEIGHT] || 1;
      });

    let regions = d3.entries(this.slide.value.regions)
      .map((d)=> {
        d._value = d.value;
        return d;
      });

    this.treemap({
      children: regions
    });

    regions.map((d) => {
      let path = ["slides", that.slide.key, "regions", d.key, "attrs"];
      let old = that.tree.get(path),
        newValues = {
          x: d.x / 100,
          y: d.y / 100,
          width: d.dx / 100,
          height: d.dy / 100
        },
        toSet;

      for(var key in newValues){
        if(old[key] !== newValues[key]){
          (toSet ? toSet : toSet = {})[key] = newValues[key];
        }
      }

      if(toSet){
        that.tree.merge(path, toSet);
      }
    });
  }
}
