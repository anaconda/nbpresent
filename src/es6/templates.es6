import $ from "jquery";

import {d3, uuid} from "nbpresent-deps";

import {MiniSlide} from "./mini";

// TODO: this needs to be an extensible, registerable thing
let _templates = [
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

class TemplateLibrary {
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

  fakeSlide(template) {
    let id = uuid.v4();
    return {
      key: id,
      value: {
        id,
        regions: template.regions.reduce((memo, template) => {
          let id = uuid.v4();
          memo[id] = $.extend({}, {id}, {attrs: template});
          return memo;
        }, {})
      }
    }
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_template_library: 1});

    this.$ui.append("button")
      .classed({btn: 1, hide_library: 1, "btn-default": 1})
      .on("click", (d) => this.picked(null))
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
      .data(_templates.map(this.fakeSlide));

    $slide.enter()
      .append("div")
      .classed({slide: 1})
      .call(this.mini.update);

    $slide.on("click", (d) => this.picked(d));
  }
}

export {TemplateLibrary};
