import {ICON} from "../../icons";


import {TourBase} from "./base";


export class SlideEditorTour extends TourBase {
  static icon(){
    return ICON.editor;
  }

  steps(){
    return [{
      element: ".nbp-deck-toolbar .fa-edit",
      title: "Edit Slide",
      content: "If you need more control, you can edit a Slide's Regions directly",
      placement: "top"
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
      element: ".region_attr .attr_name",
      placement: "right",
      title: "Attribute Editor",
      content: "All of the properties of a region can be edited here"
    }, {
      element: ".nbp-regiontree .btn-toolbar .fa-tree",
      placement: "right",
      title: "Magic Layouts",
      content: "In addition to manually moving regions around, you can use other Layouts, like this Treemap, which will fill the slide",
      onHidden: () => {
        this.mode.sorter.editor.sidebar.layout("treemap");
      }
    }, {
      element: ".region_attr .fa-tree",
      placement: "right",
      title: "Treemagic",
      content: "This new value lets you make a Region bigger or smaller based on relative Weight"
    }, {
      title: "FIN",
      content: "Thank you for using nbpresent!"
    }]
  }
}
