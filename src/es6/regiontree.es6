import d3 from "d3";
import uuid from "node-uuid";

import {Toolbar} from "./toolbar";

class RegionTree {
  constructor(slide, region){
    this.slide = slide;
    this.region = region;
    this.regions = this.slide.select("regions");

    this.initUI();
    this.update();

    this.slide.on("update", ()=> { this.killed || this.update(); });
  }

  destroy() {
    this.$ui.transition()
      .style({opacity: 0})
      .remove();
    this.killed = true;
  }

  width() {
    return 200;
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_regiontree: 1});

    let toolbar = new Toolbar();

    this.$toolbar = this.$ui.append("div")
      .datum([[{
        icon: "plus-square-o",
        click: () => this.addRegion(),
        tip: "Add Region"
      }]])
      .call(toolbar.update);
  }

  addRegion(){
    let id = uuid.v4();
    this.regions.set(id, {
      id,
      x: 0.1,
      y: 0.1,
      width: 0.8,
      height: 0.8
    });
  }

  update(){
    let regions = d3.entries(this.regions.get());

    let $regionInfo = this.$ui.selectAll(".region_info")
      .data(regions, (d) => d.key);

    $regionInfo
      .enter()
      .append("div")
      .classed({region_info: 1})
      .on("click", (d)=> {
        console.log(d);
        this.region.set([this.slide.get("id"), d.key]);
      });

    $regionInfo
      .text((d) => d.key);
  }

}

export {RegionTree};
