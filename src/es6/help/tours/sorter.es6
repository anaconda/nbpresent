import {d3, $} from "nbpresent-deps";

import {PART} from "../../parts";
import {ICON} from "../../icons";
import {SORTER} from "../../mode/notebook";

import {TourBase} from "./base";


export class SorterTour extends TourBase {
  static icon(){
    return ICON.slides;
  }

  steps(){
    return [{
      element: `.nbp-app-bar .fa-${ICON.slides}`,
      title: "Slides",
      content: "Slides make up a presentation",
      placement: "left",
      onHide: () => this.mode.mode.set(SORTER)
    }, {
      element: `.nbp-app-bar .fa-${ICON.slides}`,
      title: "Slides",
      content: "Clicking Slides toggles the sorter view",
      placement: "left"
    }, {
      element: `.nbp-deck-toolbar .fa-${ICON.addSlide}`,
      title: "Deck Toolbar",
      content: "Let's create a new slide",
      placement: "top",
      onHide: () => $(`.nbp-deck-toolbar .fa-${ICON.addSlide}`).click()
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
        d3.select(".nbp-template-library .slide:nth-of-type(1)").datum()
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
      element: `.nbp-region-toolbar .fa-${ICON.link}`,
      placement: "top",
      title: "Cell Part: Linking",
      content: "You put a Part of a cell into a Region. The Parts are Inputs, like source code or Markdown, the Outputs, such as calculations, tables and figures, and interactive Widgets, including sliders and knobs.",
      onHide: () => this.mode.sorter.linkContentOverlay()
    }, {
      element: `.nbp-region-toolbar .fa-${ICON.link}`,
      placement: "top",
      title: "Link Overlay",
      content: "The linkable Cell Parts are shown in the Link Overlay"
    }, {
      element: ".cell.selected",
      placement: "left",
      title: "Linking an Input Part",
      content: "Let's use this cell input"
    }, {
      element: ".nbp-slides-wrap .slide:last-child .nbp-region",
      placement: "top",
      title: "Part Thumbnail",
      content: "A part thumbnail might look a little funny, as it can only be reliably updated when a linked Cell Part is on-screen, but you should usually be able to get an idea of what you're seeing.",
      onShow: () => this.mode.sorter.linkContent(PART.source)
    }, {
      element: `.nbp-region-toolbar .fa-${ICON.unlink}`,
      placement: "top",
      title: "Cell Part: Unlinking",
      content: "Unlinking removes the connection between a region and a cell part, without deleting either one."
    }, {
      element: `.nbp-region-toolbar .fa-${ICON.trash}`,
      placement: "top",
      title: "Region: Trashing",
      content: "Trashing a Region permanently deletes it, without affecting any linked Cell Part"
    }, {
      title: "Achievement Unlocked: Presentation",
      content: "We're ready to look at the presentation!"
    }/*, {
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
    }*/]
  }
}
