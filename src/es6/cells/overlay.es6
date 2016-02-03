import {d3} from "nbpresent-deps";
import _ from "underscore";

import {PART, PART_SELECT, partColor} from "../parts";

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
      .classed({"nbpresent-link-overlay": 1});
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

    let $part = this.$ui.selectAll(".part-overlay")
      .data(parts);

    $part.enter()
      .append("div").classed({"part-overlay": 1})
      .on("click", ({part, cell}) => {
        this.done({part, cell: cell.value})
      })
      .call(($part)=> {
        $part.append("i").classed({
          fa: 1, "fa-fw": 1, "fa-2x": 1, "fa-link": 1
        });
      });

    let whole = (part) => part === PART.whole

    $part.style({
      top: ({bb}) => `${bb.top - heightOffset}px`,
      "margin-left": ({part}) => {
        return whole(part) ? null : "55px";
      },
      "background-color": ({part, cell}) => {
        return partColor(part)
      }
    });

    $part.exit().remove();
  }
}
