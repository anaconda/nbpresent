import {d3} from "nbpresent-deps";

import {PART} from "../../parts";
import {ICON} from "../../icons";

import {TourBase} from "./base";


export class IntroTour extends TourBase {
  static icon(){
    return ICON.intro;
  }

  steps(){
    return [{
        element: "#nbp-app-btn",
        title: "Thanks for using nbpresent",
        placement: "bottom",
        content: "You just activated nbpresent! Click Next to take the tour"
      }, {
        element: "#nbp-app-btn",
        title: "Sorter",
        placement: "bottom",
        content: "You can add, reorder and remix your slides into a great presentation"
      }, {
        element: "#nbp-present-btn",
        placement: "bottom",
        title: "Presenter",
        content: "With the Presenter, you can view that presentation, tweak the content in-place, and publish it to the world. But first..."
      }, {
        element: ".nbp-deck-toolbar .fa-plus-square-o",
        title: "Deck Toolbar",
        content: "Let's create a new slide",
        placement: "top",
        onNext: () => this.mode.sorter.addSlide()
      }, {
        element: ".from_template",
        title: "Template Library",
        position: "top",
        content: "You can pick from some existing templates..."
      }, {
        element: ".from_slide",
        title: "Reuse Slide as Template",
        position: "top",
        content: "Or copy an existing slide"
      }, {
        element: ".nbp-template-library .slide:nth-of-type(2)",
        title: "Simple Template",
        position: "top",
        content: "Let's use this one",
        onNext: () => this.mode.sorter.templatePicked(
          d3.select(".nbp-template-library .slide:nth-of-type(2)")
            .datum()
        )
      }, {
        element: ".nbp-slides-wrap .slide:last-child",
        placement: "top",
        title: "Look at the slide, just look at it",
        content: "Here's our new slide"
      }, {
        element: ".nbp-slides-wrap .slide:last-child .nbp-region",
        placement: "right",
        title: "Region",
        onShow: () => {
          let el = d3.select(".nbp-slides-wrap .slide:last-child .nbp-region");
          el.on("click")(el.datum());
        },
        content: "It has one Region"
      }, {
        element: ".nbp-region-toolbar .fa-external-link-square",
        placement: "top",
        title: "Cell Part",
        content: "You put a Part of a cell into a Region. The Parts are Inputs, like source code or Markdown..."
      }, {
        element: ".nbp-region-toolbar .fa-external-link",
        placement: "top",
        title: "Cell Part: Outputs",
        content: "... the Outputs, such as calculations, tables and figures..."
      }, {
        element: ".nbp-region-toolbar .fa-sliders",
        placement: "top",
        title: "Cell Part: Widgets",
        content: "...and interactive Widgets, including sliders and knobs."
      }, {
        element: ".nbp-region-toolbar .fa-unlink",
        placement: "top",
        title: "Cell Part: Unlinking",
        content: "Since a Part can be linked to more than one Region, you might need to Unlink one."
      }, {
        element: ".cell.selected",
        placement: "left",
        title: "Linking an Input Part",
        content: "Let's use this cell input"
      }, {
        element: ".nbp-slides-wrap .slide:last-child .nbp-region",
        placement: "top",
        title: "Part Thumbnail",
        content: "A part thumbnail might look a little funny, but you should usually be able to get an idea of what you're seeing.",
        onShow: () => this.mode.sorter.linkContent(PART.source)
      }, {
        title: "Achievement Unlocked: Presentation",
        content: "We're ready to look at the presentation!"
      }, {
        element: "#nbp-present-btn",
        title: "Great, let's have a look",
        placement: "bottom",
        content: "Clicking this button brings up the Presenter",
        onNext: () => this.mode.present()
      }, {
        title: "Looks great!",
        content: "Your slide is still made up of your notebook"
      }, {
        element: ".nbp-present",
        placement: "top",
        title: "Most Notebook Editing Functionality",
        content: "This is still an editable input area"
      }, {
        element: ".nbp-present",
        placement: "bottom",
        title: "Part Execution",
        content: "Inputs can even be executed with keyboard shortcuts like ctrl+enter"
      }, {
        element: ".presenter_toolbar .fa-step-forward",
        title: "Go forward",
        content: "Click here to go to the next Slide",
        placement: "top",
        onShown: () => this.fakeHover(".presenter_toolbar", true),
        onHidden: () => this.fakeHover(".presenter_toolbar", 0)
      }, {
        element: ".presenter_toolbar .fa-step-backward",
        title: "Go back",
        content: "Clicking here to go back to the previous slide",
        placement: "top",
        onShown: () => this.fakeHover(".presenter_toolbar", true),
        onHidden: () => this.fakeHover(".presenter_toolbar", 0)
      }, {
        element: ".presenter_toolbar .fa-fast-backward",
        title: "Go back to the beginning",
        content: "Clicking here to go back to the first Slide",
        placement: "top",
        onShown: () => this.fakeHover(".presenter_toolbar", true),
        onHidden: () => this.fakeHover(".presenter_toolbar", 0)
      }, {
        element: ".presenter_toolbar .fa-book",
        title: "My work is done here",
        content: "Click here to go back to the Notebook",
        placement: "top",
        onShown: () => this.fakeHover(".presenter_toolbar", true),
        onHidden: () => this.fakeHover(".presenter_toolbar", 0) &&
          this.mode.present()
      }, {
        element: ".nbp-deck-toolbar .fa-edit",
        title: "Edit Slide",
        content: "If you need more control, you can edit a Slide's Regions directly",
        placement: "top",
        onHidden: () => this.mode.sorter.editSlide(
          this.mode.sorter.selectedSlide.get()
        )
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
      }
    ];
  }
}
