import {d3} from "nbpresent-deps";

import {RegionTree} from "./regiontree";
import {CellManager} from "./cells/notebook";

import {bbox} from "./d3.bbox";

class Editor{
  constructor(slide, selectedRegion) {
    this.slide = slide;
    this.selectedRegion = selectedRegion;
    this.regions = this.slide.select("regions");
    this.cellManager = new CellManager();

    // TODO: make these discrete to base unit
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();


    this.initUI();
    this.sidebar = new RegionTree(this.slide, this.selectedRegion);

    this.initBehavior();

    this.update();

    this.slide.on("update", ()=> { this.killed || this.update(); });
  }

  destroy() {
    this.sidebar.destroy();
    this.$ui.transition()
      .style({opacity: 0})
      .remove();
    this.killed = true;
  }

  initBehavior(){
    this.bbox = bbox();
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_editor: 1})
      .style({opacity: 0});

    this.$bg = this.$ui.append("div")
      .classed({slide_bg: 1});

    this.$svg = this.$bg.append("svg");

    this.$defs = this.$svg.append("defs");

    this.$ui.transition()
      .style({opacity: 1});
  }

  padding(){
    return 20;
  }

  aspectRatio(){
    // TODO: put in data
    return 16 / 9;
  }

  bbEnd(el, d){
    let $el = d3.select(el),
      scales = {
        x: this.x,
        y: this.y,
        width: this.x,
        height: this.y
      };

    let selected = this.selectedRegion.get();

    if(!selected){
      return;
    }

    this.slide.merge(["regions", selected.region, "attrs"],
      d3.entries(scales)
        .reduce((memo, attr) => {
          memo[attr.key] = attr.value.invert($el.attr(attr.key));
          return memo;
        }, {}));
  }

  update(){
    let that = this,
      uibb = this.$ui.node().getBoundingClientRect(),
      width = uibb.width - (this.sidebar.width() + (2 * this.padding())),
      height = width / this.aspectRatio(),
      regions = d3.entries(this.regions.get()),
      {slide, region} = this.selectedRegion.get() || {},
      selected = this.selectedRegion.get();

    if(height > uibb.height + 2 * this.padding()){
      height = uibb.height - (2 * this.padding());
      width = height * this.aspectRatio();
    }

    this.x.range([0, width]);
    this.y.range([0, height]);
    let {x, y} = this;

    this.$bg.style({
      left: `${(((uibb.width + this.sidebar.width()) - width) / 2)}px`,
      top: `${(uibb.height - height) / 2}px`,
      width: `${width}px`,
      height: `${height}px`
    });

    this.$svg.attr({width, height});

    regions.sort((a, b) => {
      return (selected && selected.region == a.key) ? -1 :
        (selected && selected.region == b.key) ? 1 :
          (a.value.attrs.z || 0) - (b.value.attrs.z || 0)
    });

    let $region = this.$svg.selectAll(".region")
      .data(regions, (d) => d.key)
      .order();

    $region.exit().remove();

    let regionData = (region) => {
      return directions.map((dir) => {
        return {region, dir};
      })
    };

    $region.enter()
      .append("g")
      .classed({"region": 1})
      .call(($region) => {
        $region.append("rect")
          .classed({region_bg: 1})
          .each(function(d){
            that.bbox.infect(d3.select(this))
              .on("dragend", function(d){ that.bbEnd(this, d) })
              .on("resizeend", function(d){ that.bbEnd(this, d) });
          });
      })
      .on("mousedown", (d) => {
        this.selectedRegion.set({slide: this.slide.get("id"), region: d.key});
      });

    $region
      .classed({
        active: (d) => selected && (d.key == selected.region)
      })
    .select(".region_bg")
      .transition()
      .attr({
        width: (d) => x(d.value.attrs.width),
        height: (d) => y(d.value.attrs.height),
        x: (d) => x(d.value.attrs.x),
        y: (d) => y(d.value.attrs.y)
      });

    $region.filter(({value}) => !value.content)
      .select(".region_bg")
      .style({fill: null});


    $region.filter(({value}) => value.content)
      .each(function(d){
        let $region = d3.select(this);
        that.cellManager.thumbnail(d.value.content)
          .catch(function(err){
            console.warn("thumbnail error", err);
          })
          .then(function({uri, width, height}){
            let id = `${d.value.content.part}-${d.value.content.cell}`,
              bg = that.$defs.selectAll(`#${id}`).data([id]);

            bg.enter().append("pattern")
              .attr({
                patternUnits: "userSpaceOnUse",
                id
              })
            .append("image")
              .attr({
                x: 0,
                y: 0
              });

            bg.attr({width, height})
              .select("image")
              .attr({
                "xlink:href": uri,
                width,
                height
              });

            $region.select(".region_bg")
              .style({
                fill: `url(#${id})`
              });
          });
      });
  }
}

export {Editor};
