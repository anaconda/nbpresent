import {d3} from "nbpresent-deps";
import Jupyter from "base/js/namespace";

import {PART_SELECT} from "../parts";

import {BaseCellManager} from "./base";


/** Wraps the Jupyter Notebook for working with {@link Cell}s
  * @extends {BaseCellManager} */
export class NotebookCellManager extends BaseCellManager {
  /** returns an id-indexed set of {@link Cells} from the main namespace i.e.
    * `window.Jupyter`
    * @return {Object} */
  getCells(){
    return Jupyter.notebook.get_cells().reduce((memo, cell)=> {
      if(cell.metadata.nbpresent){
        memo[cell.metadata.nbpresent.id] = cell;
      }
      return memo;
    }, {});
  }

  cellId(cell){
    try {
      return cell.metadata.nbpresent.id;
    }catch(err){
      return null;
    }
  }

  /**
   Generate a sparse matrix of:
   cell * part * {cell, part, bb}
 ]
  */
  cellPartGeometry(){
    let mgr = this;
    return Jupyter.notebook.get_cells().map((cell)=>{
      let key = this.cellId(cell);

      let parts = d3.entries(PART_SELECT).map((part)=>{
        return mgr.getPart({cell: key, part: part.key}, cell.element[0])
          .reduce(function(memo, data){
            let el = data[0],
              bb = el && el.getBoundingClientRect();
            if(bb && bb.height){
              memo.push({cell: {key, value: cell}, part: part.key, bb});
            }
            return memo;
          }, []);
      });
      return parts;
    });
  }
}
