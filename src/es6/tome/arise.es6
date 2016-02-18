import {log} from "../logger";
import {PART} from "../parts";
import {BaseTome} from "./base";

/** import slideshow/RISE presentations */
export class AriseTome extends BaseTome {
  icon(){
    return "cube";
  }

  title(){
    return "RISE/reveal.js";
  }

  label() {
    let slides = this.cells()
      .map(({metadata}) => (metadata.slideshow || {}).slide_type)
      .filter(String)
      .filter((type) => ["slide", "subslide"].indexOf(type) !== -1);
    return `${slides.length} Slides`;
  }

  relevant() {
    return this.cells()
      .filter(({metadata}) => metadata.slideshow)
      .length;
  }

  study(){
    let slides = [],
      prev;

    this.cells().map((cell, i) => {
      prev = slides.slice(-1)[0];

      let slideType = (cell.metadata.slideshow || {}) .slide_type ||
        (i ? "-" : "slide");

      switch(slideType){
        case "subslide":
        case "slide":
          slides.push(this.wholeCellSlide(cell, prev ? prev.id : null));
          break;
        case "fragment":
        case "-":
          prev && this.fromSlideshowContinuation(cell, prev);
          break;
        case "notes":
        case "skip":
          break;
        default:
          log.debug(slideType, "not implemented yet");
          break;
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
}
