import {d3, uuid, $} from "nbpresent-deps";

import {MiniSlide, SLIDE_WIDTH} from "../mini";

import {MANUAL_TEMPLATES} from "./manual";

const _TEMPLATES = MANUAL_TEMPLATES;

class TemplateLibrary {
  constructor(picked) {
    this.picked = picked;

    this.initUI();

    this.mini = new MiniSlide();

    this.fakeSlide = this.fakeSlide.bind(this);
    this.update = this.update.bind(this);

    this.x = d3.scale.linear()
      .domain([0, 1])
      .range([0, SLIDE_WIDTH + 20]);

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
      .classed({"nbp-template-library": 1});

    this.$ui.append("button")
      .classed({btn: 1, hide_library: 1, "btn-default": 1})
      .on("click", () => this.picked(null))
      .append("i")
      .classed({fa: 1, "fa-remove": 1});

    this.$ui.append("h3")
      .classed({from_template: 1})
      .text("Pick template");

    this.$ui.append("h3")
      .classed({from_slide: 1})
      .text("Reuse slide as template");

    this.$slides = this.$ui.append("div")
      .classed({"npb-template-library-slides": 1});
  }

  update(){
    let $slide = this.$slides.selectAll(".slide")
      .data(_TEMPLATES.map(this.fakeSlide));

    $slide.enter()
      .append("div")
      .classed({slide: 1})
      .call(this.mini.update);

    $slide.style({left: (d, i) => `${this.x(i)}px`});

    $slide.on("click", (d) => this.picked(d));

    $slide.exit().remove();
  }
}

export {TemplateLibrary};
