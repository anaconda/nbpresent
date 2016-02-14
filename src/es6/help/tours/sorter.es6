import {ICON} from "../../icons";

import {TourBase} from "./base";


export class SorterTour extends TourBase {
  static icon(){
    return ICON.slides;
  }

  steps(){
    return []
  }
}
