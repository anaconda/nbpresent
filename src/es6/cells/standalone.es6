import {d3, html2canvas} from "nbpresent-deps";

// boo nasty hack
window.html2canvas = html2canvas;

import {PARTS, PART_SELECT} from "../parts";

let _thumbs = new Map();

export class CellManager {
  getCells(){
    let cells = {};

    d3.selectAll(".cell").each(function(){
      let el = d3.select(this),
        id = el.attr("data-nbpresent-id");

      if(id){
        cells[id] = {
          element: [el.node()]
        }
      }
    });
    return cells;
  }

  getPart(content){
    let cell = this.getCells()[content.cell];

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
