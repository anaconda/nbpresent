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
}
