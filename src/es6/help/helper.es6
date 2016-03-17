import {d3, _} from "nbpresent-deps";

import {PKG} from "../package";

import {IntroTour} from "./tours/intro";
import {SlideEditorTour} from "./tours/slide-editor";
import {SorterTour} from "./tours/sorter";


const TOURS = {
  Intro: IntroTour,
  Slides: SorterTour,
  Editor: SlideEditorTour
};


const COMMUNITY = {
  Discuss: ["envelope", PKG.discussion],
  Chat: ["comment", PKG.chat],
  Contribute: ["code-fork", PKG.homepage],
  Bugs: ["bug", PKG.bugs.url]
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

    this.$h2.append("hr");

    this.$h2
      .append("a")
      .classed({"nbp-version": 1})
      .attr({
        href: `${PKG.homepage}#${PKG.version}`
      })
      .text(PKG.version);

    this.$h1 = this.$ui.append("h1")
      .append("i").classed({"fa fa-gift fa-3x": 1});

    this.$ui.append("footer")
      .classed({"nbp-legal": 1})
      .call((legal) => {
        legal.append("span").text("©2016 ");

        legal.append("a")
          .attr({href: "https://continuum.io"})
          .text("Continuum Analytics");

        legal.append("p")
          .call((license) => {
            license.append("span").text("nbpresent is ");
            license.append("a")
              .attr({href: `https://spdx.org/licenses/${PKG.license}`})
              .text("free software");
          });
      });

    this.initTours()
      .initCommunity()
      .update();
  }

  initCommunity(){
    this.$ui.append("h2").text("Community");

    this.$ui.selectAll(".nbp-community")
      .data(d3.entries(COMMUNITY))
      .enter()
      .append("a")
      .classed({"btn btn-default nbp-community": 1})
      .attr({
        href: ({value}) => value[1],
        target: "_blank"
      })
      .call((btn) => {
        btn.append("i")
          .attr({"class": ({value}) => `fa fa-${value[0]} fa-2x`});
        btn.append("label").text(({key}) => key);
      });

    return this;
  }

  initTours(){
    this.$tours = this.$ui.append("div")
      .classed({"nbp-tours": 1});

    this.$tours.append("h2")
      .text("Guided Tours");

    let tour = this.$tours.selectAll(".nbp-tour-launcher")
      .data(d3.entries(TOURS));

    tour.enter()
      .append("a")
      .classed({"btn btn-default nbp-tour-launcher": 1})
      .call((btn) => ["i", "label"].map((el) => btn.append(el)))
      .on("click", ({value}) => this.startTour(value));

    tour.select("i")
      .attr("class", ({value}) => `fa fa-2x fa-${value.icon()}`);
    tour.select("label").text(({key}) => ` ${key}`);

    return this;
  }

  startTour(Tour){
    let tour = new Tour(this.mode);
    tour.init();
    tour.start(true);

    this.mode.mode.set(null);
  }

  update(){
    return this;
  }

  destroy(){
    this.$body.classed({"nbp-helping": 0});
    _.delay(() => this.$ui.remove(), 500);
  }
}
