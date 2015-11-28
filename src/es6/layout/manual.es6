import {d3} from "nbpresent-deps";

let KEY = "manual";

export class ManualLayout {

  constructor(tree, slide, container){
    this.tree = tree;
    this.slide = slide;
    this.container = container;
  }

  static clsKey(){
    return KEY;
  }

  key(){
    return KEY;
  }

  init(){
    let {clientWidth, clientHeight} = this.container;

    this.x = d3.scale.linear()
      .range([0, clientWidth]);
    this.y = d3.scale.linear()
      .range([0, clientHeight]);
  }

  update(region, part){
    let {x, y, width, height, z} = region.value.attrs;

    z = z || 0;

    part.style({
      height: `${this.y(height)}px`,
      left: `${this.x(x)}px`,
      top: `${this.y(y)}px`,
      width: `${this.x(width)}px`
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
