import Jupyter from "base/js/namespace";

import {PART} from "../parts";


/** The base class for automated slide creators */
export class BaseTome {
  /** construct a new tome, set up for a slide */
  constructor(sorter){
    this.sorter = sorter;
  }

  relevant(){
    return true;
  }

  study(){
    return [];
  }

  execute(){
    this.study().map((d)=> this.sorter.slides.set([d.id], d) );
  }

  cells() {
    return Jupyter.notebook.get_cells();
  }

  wholeCellSlide(cell, prev=null){
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
    };
  }
}
