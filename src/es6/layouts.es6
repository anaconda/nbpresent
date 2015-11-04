import d3 from "d3";
import uuid from "node-uuid";
import $ from "jquery";

import {MiniSlide} from "./mini";

// TODO: this needs to be an extensible, registerable thing
let layouts = [
  {
    regions: [
      {x: 0.1, y: 0.1, width: 0.8, height: 0.6},
      {x: 0.1, y: 0.7, width: 0.4, height: 0.2},
      {x: 0.5, y: 0.7, width: 0.4, height: 0.2}
    ]
  },
  {
    regions: [
      {x: 0.1, y: 0.1, width: 0.8, height: 0.8}
    ]
  },
  {
    regions: [
      {x: 0.1, y: 0.1, width: 0.2, height: 0.8},
      {x: 0.4, y: 0.1, width: 0.2, height: 0.8},
      {x: 0.7, y: 0.1, width: 0.2, height: 0.8}
    ]
  },
  {
    regions: [
      {x: 0.1, y: 0.1, width: 0.4, height: 0.4},
      {x: 0.5, y: 0.1, width: 0.4, height: 0.4},
      {x: 0.1, y: 0.5, width: 0.4, height: 0.4},
      {x: 0.5, y: 0.5, width: 0.4, height: 0.4},
    ]
  }
];

class LayoutLibrary {
  constructor(picked) {
    this.picked = picked;

    this.initUI();

    this.mini = new MiniSlide();

    this.fakeSlide = this.fakeSlide.bind(this);
    this.update = this.update.bind(this);

    this.update();
  }

  destroy() {
    this.$ui.transition()
      .style({opacity: 0})
      .remove();
    this.killed = true;
  }

  fakeSlide(layout) {
    let id = uuid.v4();
    return {
      key: id,
      value: {
        id,
        regions: layout.regions.reduce((memo, layout) => {
          let id = uuid.v4();
          memo[id] = $.extend({}, {id}, layout);
          return memo;
        }, {})
      }
    }
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_layout_library: 1});

    this.$ui.append("button")
      .classed({btn: 1, hide_library: 1, "btn-default": 1})
      .on("click", () => this.destroy())
      .append("i")
      .classed({fa: 1, "fa-remove": 1});

    this.$ui.append("h3")
      .classed({from_template: 1})
      .text("Pick template");

    this.$ui.append("h3")
      .classed({from_slide: 1})
      .text("Reuse slide as template");
  }

  update(){
    let $slide = this.$ui.selectAll(".slide")
      .data(layouts.map(this.fakeSlide));

    $slide.enter()
      .append("div")
      .classed({slide: 1})
      .call(this.mini.update);

    $slide.on("click", this.picked);
  }
}

export {LayoutLibrary};
