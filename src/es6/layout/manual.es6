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
      left: `0`,
      top: `0`,
      transform: `perspective(250px) translate3d(${this.x(x)}px, ${this.y(y)}px, ${z}px)`,
      width: `${this.x(width)}px`
    });
  }

  clean(unpresent){
    unpresent.style({
      transform: null,
      left: null,
      top: null,
      width: null,
      height: null
    });
  }
}
