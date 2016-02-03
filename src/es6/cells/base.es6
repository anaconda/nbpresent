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
