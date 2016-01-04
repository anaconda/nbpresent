import Jupyter from "base/js/namespace";

import {PART} from "../parts";
import {BaseTome} from "./base";

/** import slideshow/RISE presentations */
export class AriseTome extends BaseTome {
  cells() {
    return Jupyter.notebook.get_cells();
  }

  name() {
    let hasSlides = this.cells()
      .filter(({metadata}) => {
        return [
          "slide"
          //"subslide"
        ].indexOf((metadata.slideshow || {}).cell_type) > -1
      }).length || 1;
    return `Import ${hasSlides} from reveal.js slideshow`;
  }

  relevant() {
    return this.cells()
      .any(({metadata}) => metadata.slideshow);
  }

  study(){
    let slides = [],
      prev;

    this.cells().map((cell, i) => {
      prev = slides.slice(-1)[0];

      let slideType = (cell.metadata.slideshow || {}) .slide_type ||
        (i ? "-" : "slide");

      switch(slideType){
        case "slide":
          slides.push(this.fromSlideshowSlide(cell, prev ? prev.id : null));
          break;
        case "subslide":
          console.debug("subslide not implemented yet");
          break;
        case "fragment":
          console.debug("fragment not implemented yet");
          break;
        case "note":
          console.debug("note not implemented yet");
          break;
        case "-":
          prev && this.fromSlideshowContinuation(cell, prev);
      }
    });

    return slides;
  }

  fromSlideshowContinuation(cell, prev){
    let id = this.sorter.nextId(),
      cellId = this.sorter.cellId(cell);
    prev.regions[id] = {
      id,
      content: {cell: cellId, part: PART.whole},
      attrs: {
        x: 0.1,
        y: 0.5,
        width: 0.8,
        height: 0.4
      }
    };
  }

  fromSlideshowSlide(cell, prev=null){
    let slideId = this.sorter.nextId(),
      regionId = this.sorter.nextId(),
      cellId = this.sorter.cellId(cell),
      regions = {};

    regions[regionId] = {
      id: regionId,
      content: {
        cell: cellId,
        part: PART.whole
      },
      attrs: {
        x: 0.1,
        y: 0.1,
        width: 0.8,
        height: 0.8
      }
    };

    return {
      regions: regions,
      id: slideId,
      prev: prev
    }
  }
}
