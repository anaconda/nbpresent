import {CellManager} from "./cells";
import {PART} from "./parts";

class MiniSlide {
  constructor({selectedRegion}) {
    this.selectedRegion = selectedRegion;
    this.cellManager = new CellManager();
    this.update = this.update.bind(this);
  }

  update($region) {
    let that = this;

    $region.enter()
      .append("div")
      .classed({region: 1})
      .on("click", (d) => {
        this.selectedRegion.set([d.slide.key, d.region.key]);
      })

    $region.exit()
      .remove();

    let sRegion = this.selectedRegion.get();

    $region
      .classed({
        active: (d) => {
          return  sRegion &&
            d.slide.key == sRegion[0] &&
            d.region.key === sRegion[1];
        },
        content_source: (d) => d.region.value.content &&
          d.region.value.content.part === PART.source,
        content_outputs: (d) => d.region.value.content &&
          d.region.value.content.part === PART.outputs,
        content_widgets: (d) => d.region.value.content &&
          d.region.value.content.part === PART.widgets
      })
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
          .then(function({uri, width, height}){
            $region
              .style({
                "background-image": `url("${uri}")`
              });
          });
      });
  }
}

export {MiniSlide};
