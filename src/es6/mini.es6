import {CellManager} from "./cells";
import {PART} from "./parts";

class MiniSlide {
  constructor(selectedRegion) {
    this.selectedRegion = selectedRegion;
    this.cellManager = new CellManager();

    this._regions = (d, i) => d.value.regions;

    this.update = this.update.bind(this);
  }

  regions(_){
    return arguments.length ?
      [this._regions = d3.functor(_), this][1] :
      this._regions;
  }

  hasContent(part){
    return (d) => (d.region.value.content || {}).part === part;
  }

  update($slide) {
    let that = this;

    $slide.classed({mini: 1});

    let $region = $slide
      .selectAll(".region")
      .data((d) => d3.entries(this._regions(d)).map((region) => {
        return {slide: d, region};
      }));

    $region.enter()
      .append("div")
      .classed({region: 1})
      .on("click", (d) => {
        this.selectedRegion && this.selectedRegion.set({
          slide: d.slide.key,
          region: d.region.key
        });
      });

    $region.exit()
      .remove();

    let {slide, region} = (
      this.selectedRegion && this.selectedRegion.get()
    ) || {};

    $region
      .classed({
        active: (d) => {
          return d.slide.key === slide && d.region.key === region
        },
        content_source: this.hasContent(PART.source),
        content_outputs: this.hasContent(PART.outputs),
        content_widgets: this.hasContent(PART.widgets)
      })
      // TODO: scale
      .style({
        width: (d) => `${d.region.value.width * 160}px`,
        height: (d) => `${d.region.value.height * 90}px`,
        left: (d) => `${d.region.value.x * 160}px`,
        top: (d) => `${d.region.value.y * 90}px`
      });

    // TODO: this needs to be much better/faster
    $region
      .filter((d) => d.region.value.content)
      .filter(function(d){
        let el = d3.select(this);
        return el.classed("active") || el.style("background-image") === "none";
      })
      .each(function(d){
        var $region = d3.select(this);
        that.cellManager.thumbnail(d.region.value.content)
          .catch(function(err){
            $region
              .style({
                "background": "#333",
                "background-image": null
              });
          })
          .then(function({uri, width, height}){
            $region
              .style({
                background: null,
                "background-image": `url("${uri}")`
              });
          });
      });
  }
}

export {MiniSlide};
