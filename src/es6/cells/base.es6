/** @external {Cell} https://github.com/jupyter/notebook/blob/master/notebook/static/notebook/js/cell.js */

import {d3, html2canvas} from "nbpresent-deps";

import {log} from "../logger";
import {PART, PART_SELECT} from "../parts";

let _THUMBS = {};


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

  clearThumbnails(contents=[]){
    let keys = Object.keys(_THUMBS);
    if(contents.length){
      keys = contents.map((content) => this.contentKey(content));
    }
    keys.map((key)=>{ delete _THUMBS[key]; });
  }

  contentKey(content){
    return `${content.cell}-${content.part}`;
  }

  thumbnail(content){
    let el = this.getPart(content);
    el = el ? el.node() : null;
    if(!el){
      return Promise.reject(content);
    }
    return html2canvas(el)
      .then((canvas) => {
        return {
          canvas,
          uri: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height
        };
      }, (err) => log.error("thumbnail error", content, err));
  }
}
