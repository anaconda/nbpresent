import {d3} from "nbpresent-deps";

export class ManualLayout {
  constructor(slide){
    this.slide = slide;
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();
  }

  resetScales(element){
    let {
      clientWidth, clientHeight
    } = document.documentElement;

    this.x.range([0, clientWidth]);
    this.y.range([0, clientHeight]);
  }

  update(region, part){
    let {x, y, width, height} = region.value;

    part.style({
      height: `${this.y(height)}px`,
      left: `0`,
      top: `0`,
      transform: `translate(${this.x(x)}px, ${this.y(y)}px) translateZ(0)`,
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
