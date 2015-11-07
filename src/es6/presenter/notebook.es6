import {CellManager} from "../cells/notebook";
import {Presenter} from "./base";

export class NotebookPresenter extends Presenter {
  makeCellManager() {
    return new CellManager();
  }

  toolbarIcons(){
    return super.toolbarIcons().concat([{
      icon: "book",
      click: () => this.presenting.set(false),
      tip: "Back to Notebook"
    }]);
  }
}
