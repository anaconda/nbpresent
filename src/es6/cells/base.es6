/** @external {Cell} https://github.com/jupyter/notebook/blob/master/notebook/static/notebook/js/cell.js */

import {d3, html2canvas} from "nbpresent-deps";

// boo nasty hack
window.html2canvas = html2canvas;

import {PART, PART_SELECT} from "../parts";

let _thumbs = {};


export class BaseCellManager {
  /** return an id-indexed set of {@link Cell}-like objects: each has the
    * a fake jQuery `element` member), as embedded in HTML
    * @abstract
    * @return {Object} */
  getCells(){
    throw Error("Not Implemented");
  }

  getPart(content){
    let cell = this.getCells()[content.cell];

    if(!cell){
      return null;
    }

    let $el = d3.select(cell.element[0]),
      part = content.part === PART.whole ?
        $el : $el.select(PART_SELECT[content.part]);

    return part;
  }

  /**
   Generate a sparse matrix of:
   cell * part * {cell, part, bb}
 ]
  */
  cellPartGeometry(){
    let mgr = this;
    return d3.entries(this.getCells()).map((cell)=>{
      let parts = d3.entries(PART_SELECT).map((part)=>{
        return mgr.getPart({cell: cell.key, part: part.key})
          .map(function(data){
            let el = data[0],
              bb = el && el.getBoundingClientRect();
            return {cell, part: part.key, bb};
          });
      });
      return parts;
    });
  }

  thumbnail(content){
    let key = `${content.cell}-${content.part}`
    if(!_thumbs[key]){
      let el = this.getPart(content);
      el = el ? el.node() : null;
      if(!el){
        return Promise.reject(content);
      }
      _thumbs[key] = html2canvas(el)
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

    return _thumbs[key];
  }
}
