import {StandaloneCellManager} from "./standalone";

import Jupyter from "base/js/namespace";

export class NotebookCellManager extends StandaloneCellManager {
  getCells(){
    return Jupyter.notebook.get_cells().reduce((memo, cell)=> {
      if(cell.metadata.nbpresent){
        memo[cell.metadata.nbpresent.id] = cell;
      }
      return memo;
    }, {});
  }
}
