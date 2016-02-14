import _ from "underscore";
import {d3} from "nbpresent-deps";

import {NBP_VERSION} from "../version";

import {IntroTour} from "./tours/intro";
import {SlideEditorTour} from "./tours/slide-editor";
import {SorterTour} from "./tours/sorter";
import {ThemingTour} from "./tours/theming";


const TOURS = {
  "Intro": IntroTour,
  "Slides": SorterTour,
  "Editor": SlideEditorTour,
  "Theming": ThemingTour,
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
    let helper = this;

    this.$tours = this.$ui.append("div")
      .classed({"nbp-tours": 1});

    let tour = this.$tours.selectAll(".nbp-tour-launcher")
      .data(d3.entries(TOURS));

    tour.enter()
      .append("div")
      .classed({"nbp-tour-launcher": 1})
      .call((tour)=> {
        tour.append("a")
          .classed({"btn btn-default": 1})
          .call((a) => {
            a.append("i").classed({"fa fa-2x": 1});
            a.append("span");
          })
          .on("click", ({value}) => this.startTour(value));
      });

    tour.select("a")
      .call((a) => {
        a.select("span").text(({key}) => ` ${key}`);
        a.select("i")
          .each(function({value}){
            d3.select(this).attr("class", `fa fa-2x fa-fw fa-${value.icon()}`);
          });
      });

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
