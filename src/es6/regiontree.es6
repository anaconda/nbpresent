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
    return 300;
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
        // TODO: fix this
        // [{
        //   icon: "header",
        //   click: () => this.toggleStyle("slab"),
        //   tip: "Toggle Slab Effect"
        // }],
      ])
      .call(toolbar.update);
  }

  toggleStyle(style){
    let {slide, region} = this.selectedRegion.get() || {},
      path = ["regions", region, "style", style];
    this.slide.set(path, !this.slide.get(path));
  }

  addRegion(){
    let id = uuid.v4();
    this.slide.set(["regions", id], {
      id,
      attrs: {
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8
      }
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
      .data((region) => d3.entries(region.value.attrs)
        .map((attr) => {
          return {region, attr};
        }))

    $attr.exit().remove();

    $attr.enter()
      .append("div")
      .classed({
        region_attr: 1,
        "input-group": 1,
        "input-group-sm": 1
      })
      .call(function($attr){
        $attr.append("span").classed({"input-group-btn": 1})
          .append("button").classed({
            btn: 1,
            "btn-default": 1,
            "btn-xs": 1,
            attr_name: 1
          });

        $attr.append("span").classed({"input-group-addon": 1, attr_ns: 1})
          .append("i")
          .classed({fa: 1, "fa-fw": 1});

        $attr.append("input").classed({"form-control": 1})
          .attr({type: "text"})
          .each(function(){
            Jupyter.keyboard_manager.register_events(this);
          })
          .on("change", function(d){
            let el = d3.select(this),
              val = parseFloat(el.property("value"));
            that.slide.set(["regions", d.region.key, d.attr.key], val);
          });
      })
      .on("mousedown", function(d){
        that.makeSlider(this, d);
      });

    let layout = this.slide.get(["layout"]);

    $attr.each(function(d){
      d3.select(this)
        .style({
          display: (d) => {
            // TODO: make this extensible
            if(layout == "treemap"){
              return d.attr.key.indexOf(layout) === 0 ? null : "none";
            }else{
              return d.attr.key.indexOf("treemap") === 0 ? "none" : null;
            }
          }
        })
    });

    $attr.select(".attr_name").text((d) => {
      return d.attr.key.indexOf(":") === -1 ?
        d.attr.key :
        d.attr.key.split(":")[1];
    });
    $attr.select(".attr_ns").each(function(d){
      let hasIcon = d.attr.key.indexOf(":") !== -1;
      let el = d3.select(this)
        .style({
          display: hasIcon ? null : "none"
        });

      if(!hasIcon){
        return;
      }

      // TODO: put this in layout
      let icon = {
        treemap: "tree"
      }[d.attr.key.split(":")[0]];

      el.select(".fa")
        .classed(`fa-${icon}`, 1);

    })
    $attr.select(".form-control").attr({
      value: (d) => {
        if(typeof d.attr.value === "boolean"){
          return d.attr.value;
        }else if(typeof d.attr.value === "number"){
          return d.attr.value.toFixed(3);
        }
      }
    });
  }

  makeSlider(element, d) {
    let that = this;
    let [x, y] = d3.mouse(element);
    let el = d3.select(element);
    el.on("mousemove", function(d){
      let [x1, y1] = d3.mouse(this);
      let dx = (x1 - x) / 10;
      x = x1;
      let path = ["regions", d.region.key, "attrs", d.attr.key];
      that.slide.set(path, that.slide.get(path) + dx)
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
