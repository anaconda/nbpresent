/** @external {Cell} https://github.com/jupyter/notebook/blob/master/notebook/static/notebook/js/cell.js */

import {d3} from "nbpresent-deps";

import {PART, PART_SELECT} from "../parts";


export class BaseCellManager {
  /** return an id-indexed set of {@link Cell}-like objects: each has the
    * a fake jQuery `element` member), as embedded in HTML
    * @abstract
    * @return {Object} */
  getCells(){
    throw Error("Not Implemented");
  }

  getPart(content, element){
    let cell = this.getCells()[content.cell];

    if(!cell && !element){
      return null;
    }

    let $el = d3.select(element || cell.element[0]),
      part = content.part === PART.whole ?
        $el : $el.select(PART_SELECT[content.part]);

    return part;
  }
}
