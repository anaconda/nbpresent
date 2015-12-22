import Jupyter from "base/js/namespace";

import {PART} from "../parts";
import {BaseTome} from "./base";

/** import slideshow/RISE presentations */
export class AriseTome extends BaseTome {
  name() {
    return "Import Slideshow";
  }

  relevant() {
    return Jupyter.notebook.get_cells().any((cell, i) => {
      return cell.metadata.slideshow;
    });
  }

  study(){
    let slides = [],
      prev;

    Jupyter.notebook.get_cells().map((cell, i) => {
      prev = (slides.slice(-1)[0] || {}).id;

      let slideType = (cell.metadata.slideshow || {}) .slide_type ||
        (i ? "-" : "slide");

      switch(slideType){
        case "slide":
          slides.push(this.fromSlideshowSlide(cell, prev));
          break;
        case "subslide":
        case "fragment":
        case "note":
        case "-":
      }
    });

    return slides;
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
