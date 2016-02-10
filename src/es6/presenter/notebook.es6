import {d3} from "nbpresent-deps";

import Jupyter from "base/js/namespace";

import {NotebookCellManager} from "../cells/notebook";

import {NotebookSpeaker} from "../speaker/notebook";

import {Presenter} from "./base";

import {NotebookActions} from "../actions/notebook";

export class NotebookPresenter extends Presenter {
  makeCellManager() {
    return new NotebookCellManager();
  }
  makeSpeaker(tree){
    return new NotebookSpeaker(tree);
  }

  initActions(){
    let _actions = [{
        name: "prev-slide",
        keys: ["left"],
        value: {
          icon: 'fa-step-backward',
          help: 'previous slide',
          handler: (env) => this.speaker.retreat()
        }
      }, {
        name: "next-slide",
        keys: ["right", "space"],
        value: {
          icon: 'fa-step-forward',
          help: 'next slide',
          handler: (env) => this.speaker.advance()
        }
      }
    ];

    this.actions = new NotebookActions(_actions);
    this.actions.push();
  }

  deinitActions(){
    this.actions && this.actions.pop();
  }
}
