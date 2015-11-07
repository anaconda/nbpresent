import {CellManager} from "../cells/notebook";
import {Presenter as StandalonePresenter} from "./standalone";

export class Presenter extends StandalonePresenter {
  makeCellManager() {
    return new CellManager();
  }
}
