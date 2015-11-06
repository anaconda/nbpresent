import {CellManager as RuntimeCellManager} from "./runtime";

import Jupyter from "base/js/namespace";

export class CellManager extends RuntimeCellManager {
  getCells(){
    return Jupyter.notebook.get_cells().reduce((memo, cell)=> {
      if(cell.metadata.nbpresent){
        memo[cell.metadata.nbpresent.id] = cell;
      }
      return memo;
    }, {});
  }
}
