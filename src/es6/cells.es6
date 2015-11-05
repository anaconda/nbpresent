import {d3, html2canvas} from "nbpresent-deps";

window.html2canvas = html2canvas;

import Jupyter from "base/js/namespace";

import {PARTS, PART_SELECT} from "./parts";

let _thumbs = new Map();

class CellManager {
  getPart(content){
    let cells = Jupyter.notebook.get_cells().reduce((memo, cell)=> {
        if(cell.metadata.nbpresent){
          memo[cell.metadata.nbpresent.id] = cell;
        }
        return memo;
      },{});

    let cell = cells[content.cell];

    if(!cell){
      return null;
    }

    let $el = d3.select(cell.element[0]),
      part = $el.select(PART_SELECT[content.part]);

    return part;
  }

  thumbnail(content){
    if(!_thumbs.get(content)){
      let el = this.getPart(content);
      el = el ? el.node() : null;
      if(!el){
        return Promise.reject(content);
      }
      _thumbs.set(content,
        html2canvas(el)
          .then((canvas) => {
            return {
              canvas,
              uri: canvas.toDataURL("image/png"),
              width: canvas.width,
              height: canvas.height
            };
          }, (err)=>{
            console.log(err)
          }));
    }

    return _thumbs.get(content);
  }
}

export {CellManager};
