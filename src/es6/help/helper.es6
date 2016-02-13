import _ from "underscore";
import {d3} from "nbpresent-deps";

import {NBP_VERSION} from "../version";

import {IntroTour} from "./tours/intro";

const tours = {
  "Intro": IntroTour
};

export class Helper {
  constructor(tree, {mode}){
    this.tree = tree;
    this.mode = mode;
    this.initUI();
    _.delay(() => this.$body.classed({"nbp-helping": 1}), 10);
  }

  initUI(){
    this.$body = d3.select("body");
    this.$ui = this.$body.append("div")
      .classed({"nbp-helper": 1});

    this.$h2 = this.$ui.append("h2")
      .text("nbpresent ")
      .append("a")
      .attr({
        href: `https://github.com/anaconda-server/nbpresent#${NBP_VERSION}`
      })
      .text(NBP_VERSION);

    this.$h1 = this.$ui.append("h1")
      .append("i").classed({"fa fa-gift fa-4x": 1});

    return this.initTours()
      .update();
  }

  initTours(){
    this.$tours = this.$ui.append("div")
      .classed({"nbp-tours": 1});

    let tour = this.$tours.selectAll(".nbp-tour-launcher")
      .data(d3.entries(tours));

    tour.enter()
      .append("div")
      .classed({"nbp-tour-launcher": 1})
      .call((tour)=> {
        tour.append("a")
          .classed({"btn btn-default": 1})
          .on("click", ({value}) => this.startTour(value));
      });

    tour.select("a")
      .text(({key, value}) => key);

    return this;
  }

  startTour(Tour){
    if(this.tour){
      this.tour.destroy();
    }

    this.tour = new Tour(this.mode);
    this.tour.init();
    this.tour.restart();
  }

  update(){
    return this;
  }

  destroy(){
    // this.watcher.release();
    this.$body.classed({"nbp-helping": 0});
    _.delay(() => this.$ui.remove(), 500);
  }
}
