import d3 from "d3";

import {RegionTree} from "./regiontree";

let directions = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w"
];

class Editor{
  constructor(slide, region) {
    this.slide = slide;
    this.region = region;
    this.regions = this.slide.select("regions");


    // TODO: make these discrete to base unit
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();

    this.sidebar = new RegionTree(this.slide, this.region);

    this.initUI();
    this.initBehavior();

    this.update();

    this.slide.on("update", ()=> { this.killed || this.update(); });
  }

  destroy() {
    this.$ui.transition()
      .style({opacity: 0})
      .remove();
    this.killed = true;
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_editor: 1})
      .style({opacity: 0});

    this.$bg = this.$ui.append("div")
      .classed({slide_bg: 1});

    this.$svg = this.$bg.append("svg");

    this.$ui.transition()
      .style({opacity: 1});
  }

  initBehavior(){
    let that = this,
      {x, y} = this;

    let dragX, dragY, dragWidth, dragHeight;

    let mouse = () => d3.mouse(this.$ui);

    this.regionDrag = d3.behavior.drag()
      .on("dragstart", function(d){
        let $region = d3.select(this.parentNode)
          .classed({dragging: 1});
        dragX = d.value.x;
        dragY = d.value.y;
      })
      .on("drag", function(d){
        dragX += x.invert(d3.event.dx);
        dragY += y.invert(d3.event.dy);
        let $region = d3.select(this.parentNode)
          .attr({
            transform: (d) => `translate(${[x(dragX), y(dragY)]})`
          });
      })
      .on("dragend", function(d){
        let $region = d3.select(this.parentNode)
          .classed({dragging: 0});

        that.regions.merge(d.key, {
          x: dragX,
          y: dragY,
        });
      });

    this.handleDrag = d3.behavior.drag()
      .origin((d) => { return {x:0, y:0}; })
      .on("dragstart", function(d){
        let $handle = d3.select(this)
          .classed({dragging: 1});
        dragX = d.region.value.x;
        dragY = d.region.value.y;
        dragWidth = d.region.value.width;
        dragHeight = d.region.value.height;
      })
      .on("drag", function(d){
        let $handle = d3.select(this),
          $region = d3.select(this.parentNode);

        let dx = x.invert(d3.event.dx),
          dy = y.invert(d3.event.dy);

        if(/n/.test(d.dir)){ dragY += dy; dragHeight -= dy; }
        if(/e/.test(d.dir)){ dragWidth += dx; }
        if(/s/.test(d.dir)){ dragHeight += dy; }
        if(/w/.test(d.dir)){ dragX += dx; dragWidth -= dx; }

        $region
          .attr({
            transform: (d) => `translate(${[x(dragX), y(dragY)]})`
          })
          .select(".region_bg")
          .attr({
            width: x(dragWidth),
            height: y(dragHeight),
          });

        $region
          .selectAll(".handle")
          .attr({
            cx: (d) => {
              return x(
                /w/.test(d.dir) ? 0 :
                /e/.test(d.dir) ? dragWidth :
                dragWidth / 2
              )
            },
            cy: (d) => y(
              /n/.test(d.dir) ? 0 :
              /s/.test(d.dir) ? dragHeight :
              dragHeight / 2
            )
          });
      })
      .on("dragend", function(d){
        let $handle = d3.select(this)
          .classed({dragging: 0});

        that.regions.merge(d.region.key, {
          x: dragX,
          y: dragY,
          width: dragWidth,
          height: dragHeight
        });
      });

  }

  padding(){
    return 20;
  }

  aspectRatio(){
    // TODO: put in data
    return 16 / 9;
  }

  update(){
    let uibb = this.$ui.node().getBoundingClientRect(),
      width = uibb.width - (this.sidebar.width() + (2 * this.padding())),
      height = width / this.aspectRatio();

    if(height > uibb.height + 2 * this.padding()){
      height = uibb.height - (2 * this.padding());
      width = height * this.aspectRatio();
    }

    console.log(width, height);

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

    let regions = d3.entries(this.regions.get());

    let $region = this.$svg.selectAll(".region")
      .data(regions, (d) => d.key);

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
          .call(this.regionDrag);

        let $handle = $region.selectAll(".handle")
          .data(regionData);

        $handle.enter()
          .append("circle")
          .classed({handle: 1})
          .attr({
            r: 5
          })
          .call(this.handleDrag);
      });

    $region.attr({
        transform: (d) => `translate(${[x(d.value.x), y(d.value.y)]})`
      })
      .select(".region_bg")
      .attr({
        width: (d) => x(d.value.width),
        height: (d) => y(d.value.height)
      });

    $region.selectAll(".handle")
      .data(regionData)
      .attr({
        cx: (d) => {
          return x(
            /w/.test(d.dir) ? 0 :
            /e/.test(d.dir) ? d.region.value.width :
            d.region.value.width / 2
          )
        },
        cy: (d) => y(
          /n/.test(d.dir) ? 0 :
          /s/.test(d.dir) ? d.region.value.height :
          d.region.value.height / 2
        )
      });
  }
}

export {Editor};
