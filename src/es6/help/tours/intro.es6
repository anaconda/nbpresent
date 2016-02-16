//import {$} from "nbpresent-deps";

import {ICON} from "../../icons";

import {TourBase} from "./base";


export class IntroTour extends TourBase {
  static icon(){
    return ICON.intro;
  }

  steps(){
    return [{
        element: "#nbp-app-btn",
        title: "Thanks for using nbpresent!",
        placement: "bottom",
        content: "You just started Authoring a presentation with nbpresent"
      }, {
        element: "#nbp-app",
        title: "App Bar",
        placement: "left",
        content: "When Authoring, you control the content and style of your presentation. It also activates several special editing keyboard shortcuts"
      }, {
        element: "#nbp-app-btn",
        title: "Stop Authoring",
        placement: "bottom",
        content: "Clicking this again stops Authoring, and removes all keyboard shortcuts"
      }, {
        element: "#nbp-present-btn",
        placement: "left",
        title: "Simply Presenting",
        content: "If you just want to run your presentation, without any Authoring tools, you can start Presenting directly."
      }, {
        element: `.nbp-app-bar .fa-${ICON.presenter}`,
        placement: "left",
        title: "Presenting/Authoring",
        content: "Once we've made some slides, we'll start Presenting, where we can use most Notebook functions with the Theme we have defined, as well as customize slides on the fly."
      }, {
        element: `.nbp-app-bar .fa-${ICON.slides}`,
        placement: "left",
        title: "Slides",
        content: "Slides, made of Regions linked to Cell Parts are the bread and butter of any presentation, and can be imported, created, linked, reordered, and edited here."
      }, {
        element: `.nbp-app-bar .fa-${ICON.themer}`,
        placement: "left",
        title: "Theming",
        content: "Theming lets you select colors, typography, and backgrounds to make distinctive presentations."
      }, {
        element: "#save-notbook",
        placement: "bottom",
        title: "Saving",
        content: "Whenever you save your Notebook, all your presentation data will be stored right in the Notebook .ipynb file"
      }, {
        element: "#file_menu",
        placement: "bottom",
        title: "Downloading",
        content: "After you've made a presentation, you can download it as an HTML page by selecting Download As: Presentation (.html)"
      }, {
        element: `.nbp-app-bar .fa-${ICON.help}`,
        placement: "left",
        title: "Help",
        content: "Activate Help at any time to try other tours, connect with the nbpresent developers and community, and other information. Thanks again for using nbpresent."
      }
    ];
  }
}
