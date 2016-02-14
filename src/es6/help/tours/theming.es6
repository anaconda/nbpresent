import {TourBase} from "./base";

import {ICON} from "../../icons";


export class ThemingTour extends TourBase {
  static icon(){
    return ICON.themer;
  }

  steps(){
    return [];
  }
}
