import {d3} from "nbpresent-deps";

import {NotebookCellManager} from "./cells/notebook";
import {PART} from "./parts";

class MiniSlide {
  constructor(selectedRegion) {
    this.selectedRegion = selectedRegion;
    this.cellManager = new NotebookCellManager();

    this._regions = (d, i) => d.value.regions;

    this.update = this.update.bind(this);
    this.clicked = this.clicked.bind(this);
  }

  regions(_){
    return arguments.length ?
      [this._regions = d3.functor(_), this][1] :
      this._regions;
  }

  hasContent(part){
    return (d) => (d.region.value.content || {}).part === part;
  }

  clicked(d){
    // if called outside the d3 context...
    d = d || d3.select(this).datum();

    if(!this.selectedRegion){
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
    let that = this;

    $slide.classed({
      mini: 1,
      no_id: (d) => !d.key
    });

    let $region = $slide
      .selectAll(".region")
      .data((d) => d3.entries(this._regions(d)).map((region) => {
        return {slide: d, region};
      }));

    $region.enter()
      .append("div")
      .classed({region: 1})
      .on("click", this.clicked);

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
        content_widgets: this.hasContent(PART.widgets),
        content_whole: this.hasContent(PART.whole)
      })
      // TODO: scale
      .style({
        width: (d) => `${d.region.value.attrs.width * 160}px`,
        height: (d) => `${d.region.value.attrs.height * 90}px`,
        left: (d) => `${d.region.value.attrs.x * 160}px`,
        top: (d) => `${d.region.value.attrs.y * 90}px`
      });
  }
}

export {MiniSlide};
