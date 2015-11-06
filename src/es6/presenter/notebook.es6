import {CellManager} from "../cells/notebook";
import {Presenter as RuntimePresenter} from "./runtime";

export class Presenter extends RuntimePresenter {
  makeCellManager() {
    return new CellManager();
  }
}
