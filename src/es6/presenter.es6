import d3 from "d3";

import Jupyter from "base/js/namespace";

import {Toolbar} from "./toolbar";

class Presenter {
  constructor(tree) {
    this.tree = tree;

    this.initUI();

    this.presenting = this.tree.select(["presenter", "presenting"]);
    this.current = this.tree.select(["presenter", "current"]);

    this.presenting.on("update", () => this.present());
    this.current.on("update", () => this.update());
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_presenter: 1});

    this.initToolbar();
  }


  initToolbar(){
    let toolbar = new Toolbar();

    toolbar.btnClass("btn-invert");

    this.$toolbar = this.$ui.append("div")
      .datum([
        [{
          icon: "dedent",
          on: {click: () => this.presenting.set(false) }
        },
        {
          icon: "fast-backward",
          on: {click: () => this.current.set(0) }
        },
        {
          icon: "step-backward",
          on: {click: () => this.current.set(this.current.get() - 1) }
        },
        {
          icon: "step-forward",
          on: {click: () => this.current.set(this.current.get() + 1) }
        }]
      ])
      .call(toolbar.update);
  }

  present() {
    let presenting = this.presenting.get();
    this.$ui
      .transition()
      .style({
        opacity: +presenting,
        display: presenting ? "block" : "none"
      });

    this.current.set(0);
  }

  update() {
    let slide = this.tree.get("sortedSlides")[this.current.get()];
    console.log(slide);
  }
}

export {Presenter};
