import {d3, _} from "nbpresent-deps";

import {ManualLayout} from "./manual";

let KEY = "grid",
  PAD = "pad",
  TOLERANCE = 0.001;

export class GridLayout extends ManualLayout {
  static clsKey(){
    return KEY;
  }

  key(){
    return KEY;
  }

  attrDefaults() {
    var attrs = {};
    attrs[PAD] = 0.01;
    return attrs;
  }

  nice(memo, opts){
    let [base] = opts,
      d = memo._d,
      rounded = Math.round(d[base] * 12),
      normalized = rounded / 12;

    if(Math.abs(normalized - d[base]) > TOLERANCE){
      memo[base] = normalized;
    }
    return memo;
  }

  init(){
    super.init();

    let regions = d3.entries(this.slide.value.regions);

    regions.map((d) => {
      let path = ["slides", this.slide.key, "regions", d.key, "attrs"];

      let attrs = _.reduce([
        ["x", 0, 10],
        ["y", 0, 10],
        ["width", 1, 11],
        ["height", 1, 11]
      ], this.nice, {_d: d.value.attrs}, this);

      delete attrs._d;

      let needsMerge = !_.isEmpty(attrs) && !_.isEqual(
          attrs,
          _.pick(
            d.value.attrs,
            "x", "y", "width", "height", PAD));

      if(needsMerge){
        this.tree.merge(path, attrs);
      }
    });
  }
}
