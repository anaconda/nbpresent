import Jupyter from "base/js/namespace";
import {BaseActions, NS} from "./base";

export class NotebookActions extends BaseActions{
  register(){
    this._kbm = Jupyter.notebook.keyboard_manager;

    this.keyActions.map(({name, value}) => {
      this._kbm.actions.register(value, name, NS);
    });
  }

  push(){
    this.keyActions.map(({name, keys=[]}) => {
      keys.map((key) => {
        this._kbm.command_shortcuts.add_shortcut(key, `${NS}:${name}`);
      })
    });
  }

  pop(){
    this.keyActions.map(({keys=[], name}) => {
      keys.map((key) => {
        if(this._kbm.command_shortcuts.get_shortcut(key) === `${NS}:${name}`){
          this._kbm.command_shortcuts.remove_shortcut(key);
        }
      });
    });
  }
}
