import {d3, uuid} from "nbpresent-deps";

import {Toolbar} from "./toolbar";
import {MiniSlide} from "./mini";

class RegionTree {
  constructor(slide, region){
    this.slide = slide;
    this.selectedRegion = region;

    this.mini = (new MiniSlide(this.selectedRegion))
      .regions((d) => {
        var obj = {};
        obj[d.region.id] = d.region;
        return obj;
      });

    this.initUI();
    this.update();

    this.update = this.update.bind(this);

    this.slide.on("update", this.update);
    this.selectedRegion.on("update", this.update);
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

  layout(layout){
    this.slide.set("layout", layout);
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_regiontree: 1});

    let toolbar = new Toolbar();

    this.$toolbar = this.$ui.append("div")
      .datum([
        [{
          icon: "plus-square-o",
          click: () => this.addRegion(),
          tip: "Add Region"
        }],
        // TODO: make this extensible
        [{
          icon: "arrows",
          click: () => this.layout("manual"),
          tip: "Manual Layout"
        },{
          icon: "tree",
          click: () => this.layout("treemap"),
          tip: "Treemap Layout"
        }],
      ])
      .call(toolbar.update);
  }

  addRegion(){
    let id = uuid.v4();
    this.slide.set(["regions", id], {
      id,
      x: 0.1,
      y: 0.1,
      width: 0.8,
      height: 0.8
    });
  }

  update(){
    if(this.killed){
      return;
    }

    let that = this;

    let regions = d3.entries(this.slide.get("regions")),
      $region = this.$ui.selectAll(".region_info")
        .data(regions, (d) => d.key),
      slide = this.slide.get();

    $region
      .enter()
      .append("div")
      .classed({region_info: 1});

    let $mini = $region
      .selectAll(".slide")
      .data((d) => [{value: slide, key: slide.id, region: d.value}]);

    $mini.enter()
      .append("div")
      .classed({slide: 1});

    $mini.exit().remove();

    $mini.call(this.mini.update);

    let $attr = $region.selectAll(".region_attr")
      .data((region) => d3.entries(region.value)
        .filter((d) => ["id", "content"].indexOf(d.key) === -1)
        .map((attr) => {
          return {region, attr};
        }))

    $attr.exit().remove();

    $attr.enter()
      .append("button")
      .classed({btn: 1, "btn-default": 1, "btn-xs": 1, region_attr: 1})
      .call(function($attr){
        $attr.append("span").classed({name: 1});
        $attr.append("span").classed({badge: 1});
      })
      .on("mousedown", function(d){
        that.makeSlider(this, d);
      });

    $attr.select(".name").text((d) => `${d.attr.key} `);
    $attr.select(".badge").text((d) => d.attr.value);
  }

  makeSlider(element, d) {
    let that = this;
    let [x0, y0] = d3.mouse(element);
    let el = d3.select(element);
    el.on("mousemove", function(d){
        let [x1, y1] = d3.mouse(this);
        let path = ["regions", d.region.key, d.attr.key];
        that.slide.set(path, that.slide.get(path) + ((x1 - x0) / 100))
      })
      .on("mouseup", function(){
          el.on("mousemove", null);
      })
      .on("mouseexit", function(){
        el.on("mousemove", null);
      });
  }

}

export {RegionTree};
