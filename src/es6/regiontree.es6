import {d3, uuid} from "nbpresent-deps";

import Jupyter from "base/js/namespace";

import {ICON} from "./icons";
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

    this.watcher = this.slide.tree.watch({
      slide: this.slide,
      selectedRegion: this.selectedRegion
    });
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


  /** Set the layout to the given key
    * @param {String} layout - the layout to use
    * @return {RegionTree} */
  layout(layout){
    this.slide.set("layout", layout);
    return this;
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({"nbp-regiontree": 1});

    let toolbar = new Toolbar();

    this.$toolbar = this.$ui.append("div")
      .datum([
        [{
          icon: ICON.addRegion,
          click: () => this.addRegion(),
          label: "+ Region"
        }],
        // TODO: make this extensible
        [{
          icon: ICON.manual,
          click: () => this.layout("manual"),
          label: "Free"
        }, {
          icon: ICON.treemap,
          click: () => this.layout("treemap"),
          label: "Treemap"
        }, {
          icon: ICON.grid,
          click: () => this.layout("grid"),
          label: "Grid"
        }]
      ])
      .call(toolbar.update);
  }

  toggleStyle(style){
    let {region} = this.selectedRegion.get() || {},
      path = ["regions", region, "style", style];
    this.slide.set(path, !(this.slide.get(path)));
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

    let regions = d3.entries(this.slide.get("regions") || {}),
      $region = this.$ui.selectAll(".region_info")
        .data(regions, ({key}) => key),
      slide = this.slide.get();

    $region
      .enter()
      .append("div")
      .classed({region_info: 1});

    $region.exit()
      .transition()
      .style({opacity: 0})
      .remove();

    let $mini = $region
      .selectAll(".slide")
      .data((d) => [{
        value: slide,
        key: slide.id,
        region: d.value
      }]);

    $mini.enter()
      .append("div")
      .classed({slide: 1});

    $mini.exit().transition()
      .style({opacity: 0})
      .remove();

    $mini.call(this.mini.update);

    let layout = this.slide.get(["layout"]);

    let $attr = $region.selectAll(".region_attr")
      .data((region) =>
        d3.entries(region.value.attrs)
          .map((attr) => { return {region, attr}; })
          .filter((d)=>{
            if(layout == "treemap"){
              return d.attr.key.indexOf(layout) === 0;
            }else{
              return d.attr.key.indexOf("treemap") === -1;
            }
          })
        )


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
        treemap: "tree",
        grid: "calculator"
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

  makeSlider(element) {
    let that = this,
      x = d3.mouse(element)[0],
      el = d3.select(element);

    el.on("mousemove", function(d){
      let x1 = d3.mouse(this)[0],
        dx = (x1 - x) / 20,
        path = ["regions", d.region.key, "attrs", d.attr.key];

      x = x1;

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
