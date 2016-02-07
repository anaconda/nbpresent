import {d3} from "nbpresent-deps";
import {BaseCellManager} from "./base";


/** A Cell Manager for static HTML
  * @extends {BaseCellManager} */
export class StandaloneCellManager extends BaseCellManager {
  /** return an id-indexed set of {@link Cell}-like objects: each has the
    * a fake jQuery `element` member), as embedded in HTML
    * @return {Object} */
  getCells(){
    let cells = {};

    d3.selectAll(".cell").each(function(){
      let el = d3.select(this),
        id = el.attr("data-nbp-id");

      if(id){
        cells[id] = {
          element: [el.node()]
        }
      }
    });
    return cells;
  }
}
