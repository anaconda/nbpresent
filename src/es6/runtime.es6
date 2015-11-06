import {Presenter} from "./presenter/runtime";
import {Baobab} from "nbpresent-deps";

export function start(){
  let tree = new Baobab({}),
    presenter = new Presenter(tree);
  presenter.present();
}
