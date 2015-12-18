import {StandalongCellManager} from "../cells/standalone";
import {Presenter} from "./base";

export class StandalonePresenter extends Presenter {
  makeCellManager() {
    return new StandalongCellManager();
  }
}
