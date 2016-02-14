import {d3, _} from "nbpresent-deps";

import {PART} from "../parts";

export class LinkOverlay{
  constructor(manager, done){
    this.manager = manager;
    this.done = done;
    this.init();
  }

  init(){
    this.$header = d3.select("#header");
    this.$site = d3.select("#site");
    this.$ui = d3.select("#notebook-container")
      .append("div")
      .classed({"nbp-link-overlay": 1});
    this.update();
  }

  destroy(){
    this.$ui.remove();
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
      .call(($part)=> {
        $part.append("i").classed({"fa fa-fw fa-2x fa-link": 1});
      });

    $part.classed({
      "nbp-part-overlay-source": ({part}) => part === PART.source,
      "nbp-part-overlay-outputs": ({part}) => part === PART.outputs,
      "nbp-part-overlay-widgets": ({part}) => part === PART.widgets,
      "nbp-part-overlay-whole": ({part}) => part === PART.whole
    });

    $part.style({
      top: ({bb}) => `${bb.top - heightOffset}px`
    });

    $part.exit().remove();
  }
}
