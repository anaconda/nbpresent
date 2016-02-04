import {d3} from "nbpresent-deps";

import Jupyter from "base/js/namespace";

import {NotebookCellManager} from "../cells/notebook";

import {NotebookSpeaker} from "../speaker/notebook";

import {Presenter} from "./base";


export class NotebookPresenter extends Presenter {
  makeCellManager() {
    return new NotebookCellManager();
  }
  makeSpeaker(tree){
    return new NotebookSpeaker(tree);
  }

  initActions(){
    let _actions = {
      "prev-slide": {
        icon: 'fa-step-backward',
        help: 'previous slide',
        handler: (env) => this.speaker.retreat()
      },
      "next-slide": {
        icon: 'fa-step-forward',
        help: 'next slide',
        handler: (env) => this.speaker.advance()
      }
    };

    d3.entries(_actions).map(({key, value}) => {
      Jupyter.notebook.keyboard_manager.actions.register(
        value,
        key,
        "nbpresent"
      );
    });


    Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts({
      "left": "nbpresent:prev-slide",
      "right": "nbpresent:next-slide",
      "space": "nbpresent:next-slide",
    });
  }

  deinitActions(){
    ["left", "right", "space"]
      .map((shortcut) =>{
        try{
          Jupyter.notebook.keyboard_manager.command_shortcuts.remove_shortcut(
            shortcut
          );
        } catch(err) {

        }
      })
  }
}
