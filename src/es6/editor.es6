import d3 from "d3";

class Editor{
  constructor(slide) {
    this.slide = slide;
    this.regions = this.slide.select("regions");

    this.x = d3.scale.linear();
    this.y = d3.scale.linear();

    this.initUI();
    this.initBehavior();

    this.update();

    this.slide.on("update", ()=> { this.update(); });
  }

  destroy() {
    this.$ui.remove();
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({"nbpresent-editor": 1});

    this.$bg = this.$ui.append("div")
      .classed({"slide-bg": 1});

    this.$svg = this.$bg.append("svg");
  }

  initBehavior(){
    let that = this,
      {x, y} = this;

    let dragX, dragY;

    this.regionDrag = d3.behavior.drag()
      .on("dragstart", function(d){
        let $region = d3.select(this)
          .classed({dragging: 1});
        dragX = d.value.x;
        dragY = d.value.y;
      })
      .on("drag", function(d){
        dragX += x.invert(d3.event.dx);
        dragY += y.invert(d3.event.dy);
        let $region = d3.select(this)
          .attr({
            transform: (d) => `translate(${[x(dragX), y(dragY)]})`
          });
      })
      .on("dragend", function(d){
        let $region = d3.select(this)
          .classed({dragging: 0});

        that.regions.merge(d.key, {
          x: dragX,
          y: dragY,
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
      width = uibb.width - (2 * this.padding()),
      height = width / this.aspectRatio();

    if(height > uibb.height + 2 * this.padding()){
      height = uibb.height - (2 * this.padding());
      width = height * this.aspectRatio();
    }

    this.x.range([0, width]);
    this.y.range([0, height]);

    this.$bg.style({
      left: `${(uibb.width - width) / 2}px`,
      top: `${(uibb.height - height) / 2}px`,
      width: `${width}px`,
      height: `${height}px`
    });

    this.$svg.attr({width, height});

    let regions = d3.entries(this.regions.get());

    console.table(regions.map(({value}) => value));

    let $region = this.$svg.selectAll(".region")
      .data(regions, (d) => d.key);

    $region.exit().remove();

    $region.enter()
      .append("g")
      .classed({"region": 1})
      .call(function($region){
        $region.append("rect")
          .classed({"region-bg": 1});
      })
      .call(this.regionDrag);

    let {x, y} = this;

    $region.attr({
        transform: (d) => `translate(${[x(d.value.x), y(d.value.y)]})`
      })
      .select(".region-bg")
      .attr({
        width: (d) => x(d.value.width),
        height: (d) => y(d.value.height)
      });
  }
}

export {Editor};
