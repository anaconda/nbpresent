import {d3} from "nbpresent-deps";

let KEY = "manual";

export class ManualLayout {
  static clsKey(){
    return KEY;
  }

  regions() { return d3.entries(this.slide.value.regions); }
  key(){ return KEY; }

  attrDefaults() {
    return {
      x: 0.1,
      y: 0.1,
      width: 0.8,
      height: 0.8
    };
  }

  constructor(tree, slide, container){
    this.tree = tree;
    this.slide = slide;
    this.container = container;
  }

  init(){
    let {clientWidth, clientHeight} = this.container;

    this.x = d3.scale.linear()
      .range([0, clientWidth]);
    this.y = d3.scale.linear()
      .range([0, clientHeight]);

    // initialize missing values
    this.initAttrs();
  }

  initAttrs(){
    // initialize missing values
    let regions = this.regions();

    d3.entries(this.attrDefaults())
      .map(({key, value})=>{
        regions
          .filter((d) => d.value.attrs[key] == null)
          .map((d) => {
            var attrs = {};
            attrs[key] = value;
            this.tree.merge(
              ["slides", this.slide.key, "regions", d.key, "attrs"],
              attrs
            );
          });
        });
  }

  update(region, part){
    let {x, y, width, height, z, pad} = region.value.attrs;

    z = z || 0;
    pad = pad || 0;

    part.style({
      height: `${parseInt(this.y(height - (2 * pad)))}px`,
      left: `${parseInt(this.x(x + pad))}px`,
      top: `${parseInt(this.y(y + pad))}px`,
      width: `${parseInt(this.x(width + (2 * pad)))}px`
    });
  }

  clean(unpresent){
    unpresent.style({
      left: null,
      top: null,
      width: null,
      height: null
    });
  }
}
