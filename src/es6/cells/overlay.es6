import {d3, _} from "nbpresent-deps";

import {PART} from "../parts";

export class LinkOverlay{
  constructor(manager, done){
    this.manager = manager;
    this.done = done;
    this.init();
  }

  init(){
    this.$body = d3.select("body");
    this.$header = this.$body.select("#header");
    this.$site = this.$body.select("#site");
    this.$ui = this.$body.select("#notebook-container")
      .append("div")
      .classed({"nbp-link-overlay": 1});
    this.update();

    _.defer(() => this.$body.classed({"nbp-linking": 1}));
  }

  destroy(){
    this.$body.classed({"nbp-linking": 0});
    _.delay(() => this.$ui.remove(), 300);
  }

  update(){
    let heightOffset = this.$header.property("clientHeight") -
        this.$site.property("scrollTop"),
      parts = _.chain(this.manager.cellPartGeometry())
        .flatten()
        .filter(({bb}) => bb)
        .value();

    let $part = this.$ui.selectAll(".nbp-part-overlay")
      .data(parts);

    $part.enter()
      .append("button").classed({"btn nbp-part-overlay": 1})
      .on("click", ({part, cell}) => this.done({part, cell: cell.value}))
      .text(({part}) => part);

    $part.classed({
      "nbp-part-overlay-source": ({part}) => part === PART.source,
      "nbp-part-overlay-outputs": ({part}) => part === PART.outputs,
      "nbp-part-overlay-widgets": ({part}) => part === PART.widgets,
      "nbp-part-overlay-whole": ({part}) => part === PART.whole
    });

    $part.style({
      top: ({bb}) => `${bb.top - heightOffset}px`,
      height: ({bb}) => `${bb.height - 1}px`
    });

    $part.exit().remove();
  }
}
