import {_} from "nbpresent-deps";

import {ICON} from "../../icons";

import {SORTER} from "../../mode/notebook";

import {TourBase} from "./base";


export class SlideEditorTour extends TourBase {
  static icon(){
    return ICON.editor;
  }

  steps(){
    return [{
      element: `.nbp-app-bar .fa-${ICON.slides}`,
      title: "So You Made Some Slides",
      content: "Once you've made a few slides, you'll likely need to customize them",
      placement: "left",
      onShown: () => {
        this.mode.mode.set(SORTER);
        _.delay(() => this.mode.sorter.appendSlide(), 500);
      }
    }, {
      element: `.nbp-deck-toolbar .fa-${ICON.editor}`,
      title: "Editing Slides",
      content: "Once you have selected a slide, you can activate the Slide Editor",
      placement: "left",
      onHide: () => _.defer(() => {
        this.mode.sorter.editSlide();
      })
    }, {
      element: ".nbp-editor .slide_bg",
      placement: "top",
      title: "Region Editor",
      content: "This is the Region editor. You can click and drag Regions around and resize them."
    }, {
      element: ".nbp-regiontree",
      placement: "right",
      title: "Region Tree",
      content: "This is the Region tree. It lets you reorder Regions and see the details of how your Regions will show their linked Parts."
    }, {
      element: `.nbp-regiontree > .nbp-toolbar .fa-${ICON.addRegion}`,
      placement: "right",
      title: "Add Region",
      content: "You can add new regions",
      onShow: () => _.defer(() => this.mode.sorter.editor.sidebar.addRegion())
    }, {
      element: ".region_attr:first-of-type .attr_name",
      placement: "right",
      title: "Attribute Editor",
      content: "All of the properties of a region can be edited here"
    }, {
      element: `.nbp-regiontree .btn-toolbar .fa-${ICON.treemap}`,
      placement: "right",
      title: "Data Layouts",
      content: "In addition to manually moving regions around, you can use other Layouts, like this Treemap, which will fill the slide",
      onHidden: () => {
        this.mode.sorter.editor.sidebar.layout("treemap");
      }
    }, {
      element: `.nbp-regiontree > .nbp-toolbar .fa-${ICON.addRegion}`,
      placement: "right",
      title: "More Regions",
      content: "More regions will be added with a weight of 1",
      onShow: () => _.defer(() => this.mode.sorter.editor.sidebar.addRegion())
    }, {
      element: `.region_attr .fa-${ICON.treemap}`,
      placement: "right",
      title: "Tree Weight",
      content: "This new value lets you make a Region bigger or smaller based on relative Weight"
    }, {
      element: `.nbp-regiontree .btn-toolbar .fa-${ICON.grid}`,
      placement: "right",
      title: "12 Grid",
      content: "The Grid is a comprimise between Free layout and Treemap layout, and rounds all the values to a factor of 12",
      onShow: () => this.mode.sorter.editor.sidebar.layout("grid")
    }, {
      title: "FIN",
      content: "Thank you for using nbpresent!"
    }]
  }
}
