import d3 from "d3";

import html2canvas from "html2canvas";
window.html2canvas = html2canvas;

import Jupyter from "base/js/namespace";

import {PARTS, PART_SELECT} from "./parts";

class CellManager {
  getPart(content){
    let cells = Jupyter.notebook.get_cells().reduce((memo, cell)=> {
        if(cell.metadata.nbpresent){
          memo[cell.metadata.nbpresent.id] = cell;
        }
        return memo;
      },{});

    let cell = cells[content.cell],
      $el = d3.select(cell.element[0]),
      part = $el.select(PART_SELECT[content.part]);

    return part;
  }

  thumbnail(content){
    let el = this.getPart(content).node();
    return html2canvas(el)
      .then((canvas) => {
        return {
          canvas,
          uri: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height
        };
      }, (err)=>{
        console.log(err)
      });
  }
}

export {CellManager};
