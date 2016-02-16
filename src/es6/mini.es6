import {d3} from "nbpresent-deps";

import {NotebookCellManager} from "./cells/notebook";
import {PART} from "./parts";

// TODO: refactor this
export const SLIDE_WIDTH = 160,
  SLIDE_HEIGHT = 90;

class MiniSlide {
  width() {
    return SLIDE_WIDTH;
  }

  height(){
    return SLIDE_HEIGHT;
  }

  constructor(selectedRegion) {
    this.selectedRegion = selectedRegion;
    this.cellManager = new NotebookCellManager();

    this._regions = ({value}) => value.regions;

    this.update = this.update.bind(this);
    this.clicked = this.clicked.bind(this);
  }

  regions(_){
    return arguments.length ?
      [this._regions = d3.functor(_), this][1] :
      this._regions;
  }

  hasContent(part){
    return (d) => (d.region.value.content || {}).part == part;
  }

  clicked(d){
    // if called outside the d3 context...
    d = d || d3.select(this).datum();

    if(!(this.selectedRegion)){
      return;
    }

    let {slide, region} = this.selectedRegion.get() || {};

    if(slide === d.slide.key && region === d.region.key){
      return this.selectedRegion.set(null);
    }

    this.selectedRegion.set({
      slide: d.slide.key,
      region: d.region.key
    });
  }

  update($slide) {
    let cellManager = this.cellManager;

    $slide.classed({"nbp-mini": 1});

    let $region = $slide
      .selectAll(".nbp-region")
      .data((d) => d3.entries(this._regions(d)).map((region) => {
        return {slide: d, region};
      }));

    $region.enter()
      .append("div")
      .classed({"nbp-region": 1})
      .on("click", this.clicked)
      .on("mouseover", function({region}){
        if(region.value.content){
          cellManager.thumbnail(region.value.content)
            .then(({uri}) => {
              d3.select(this).style({"background-image": `url(${uri})`})
            });
        }else{
          d3.select(this).style({"background-image": null});
        }
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
        "nbp-content-source": this.hasContent(PART.source),
        "nbp-content-outputs": this.hasContent(PART.outputs),
        "nbp-content-widgets": this.hasContent(PART.widgets),
        "nbp-content-whole": this.hasContent(PART.whole),
        "nbp-content-null": this.hasContent(null)
      })
      // TODO: scale
      .style({
        width: (d, i) => `${d.region.value.attrs.width * this.width(d, i)}px`,
        height: (d, i) => `${d.region.value.attrs.height  * this.height(d, i)}px`,
        left: (d, i) => `${d.region.value.attrs.x * this.width(d, i)}px`,
        top: (d, i) => `${d.region.value.attrs.y * this.height(d, i)}px`
      });
  }
}

export {MiniSlide};
