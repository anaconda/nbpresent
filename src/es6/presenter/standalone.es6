import {d3} from "nbpresent-deps";
import {StandaloneCellManager} from "../cells/standalone";
import {Presenter} from "./base";

const KEYS = {
  ESC: 27,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
};

export class StandalonePresenter extends Presenter {
  makeCellManager() {
    return new StandaloneCellManager();
  }

  initActions(){
    d3.select("body")
      .on("keydown", ()=>{
        switch(d3.event.keyCode){
          case KEYS.RIGHT:
          case KEYS.SPACE:
            this.speaker.advance();
            break;
          case KEYS.LEFT:
            this.speaker.retreat();
            break;
          case KEYS.ESC:
            this.present();
            break;
        }
      });
  }
}
