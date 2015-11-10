import {d3} from "nbpresent-deps";

import {ManualLayout} from "./manual";

let KEY = "treemap";

export class TreemapLayout extends ManualLayout {
  static clsKey(){
    return KEY;
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
        return d._value["treemap:weight"] || 1;
      });

    let regions = d3.entries(this.slide.value.regions)
      .map((d)=> {
        d._value = d.value;
        return d;
      })

    // initialize missing values
    regions
      .filter((d) => d.value["treemap:weight"] == null)
      .map((d) => {
        that.tree.merge(["slides", that.slide.key, "regions", d.key], {
          "treemap:weight": d.value["treemap:weight"] || 1
        });
      });

    this.treemap({
      children: regions
    });

    regions.map((d) => {
      let path = ["slides", that.slide.key, "regions", d.key];
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
