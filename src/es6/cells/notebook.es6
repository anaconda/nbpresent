import Jupyter from "base/js/namespace";

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
}
