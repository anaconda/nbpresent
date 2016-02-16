import {d3, $} from "nbpresent-deps";

import Jupyter from "base/js/namespace";

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
      placement: "left",
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
      title: "Cells",
      position: "top",
      content: "Here's are some new cells the Tour will play with",
      onShow: () => {
        let code = Jupyter.notebook.insert_cell_at_index("code", 0),
          markdown = Jupyter.notebook.insert_cell_at_index("markdown", 0);

        markdown.code_mirror.setValue('# Hello, _nbpresent_!');
        code.code_mirror.setValue('import nbpresent\nnbpresent.__version__');
      }
    }, {
      element: ".nbp-template-library .slide:nth-of-type(1)",
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
      placement: "top",
      title: "Region",
      onShow: () => {
        let el = d3.select(".nbp-slides-wrap .slide:last-child .nbp-region");
        el.on("click")(el.datum());
      },
      content: "It has one Region"
    }, {
      element: `.nbp-region-toolbar .fa-${ICON.link}`,
      placement: "top",
      title: "Linking a Region to a Cell Part",
      content: "Each Region can be linked to a single Cell Part",
      onHide: () => this.mode.sorter.linkContentOverlay()
    }, {
      element: `.nbp-region-toolbar .fa-${ICON.link}`,
      placement: "top",
      title: "Link Overlay",
      content: "The Link Overlay shows all of the parts available"
    }, {
      element: `.nbp-link-overlay .nbp-part-overlay-source:first-of-type`,
      placement: "right",
      title: "Cell Part: Source",
      content: "Source, such as code and Markdown text"
    }, {
      element: `.nbp-link-overlay .nbp-part-overlay-outputs:first-of-type`,
      placement: "right",
      title: "Cell Part: Outputs",
      content: "Outputs, such as rich figures and script results"
    }, {
      element: `.nbp-link-overlay .nbp-part-overlay-widgets:first-of-type`,
      placement: "bottom",
      title: "Cell Part: Widgets",
      content: "If you use them, all the Widgets of a cell can be shown together"
    }, {
      element: `.nbp-link-overlay .nbp-part-overlay-whole:first-of-type`,
      placement: "left",
      title: "Cell Part: Whole",
      content: "Finally, a Whole Cell (including its Source, Widgets, and Outputs) can be linked to a single region"
    }, {
      element: ".cell.selected",
      placement: "left",
      title: "Linking an Input Part",
      content: "Let's use this cell input",
      onHide: () => this.mode.sorter.linkContent(PART.source)
    }, {
      element: ".nbp-slides-wrap .slide:last-child .nbp-region",
      placement: "top",
      title: "Part Thumbnail",
      content: "A part thumbnail might look a little funny, as it can only be reliably updated when a linked Cell Part is on-screen when you mouse over it, but you should usually be able to get an idea of what you're seeing."
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
    }, {
      element: "#nbp-present-btn",
      title: "Great, let's have a look",
      placement: "bottom",
      content: "Clicking this button brings up the Presenter",
      onNext: () => {
        this.mode.present();
        this.mode.mode.set(null);
      }
    }, {
      title: "Looks great!",
      content: "Your slide is still made up of your notebook"
    }, {
      element: ".nbp-present",
      placement: "top",
      title: "It's still a Notebook",
      content: "This is still an editable input area"
    }, {
      element: ".nbp-present",
      placement: "bottom",
      title: "Part Execution",
      content: "Inputs can even be executed with keyboard shortcuts like ctrl+enter"
    }, {
      element: ".nbp-presenter-toolbar .fa-step-forward",
      title: "Go forward",
      content: "Click here to go to the next Slide",
      placement: "top",
      onShown: () => this.fakeHover(".nbp-presenter-toolbar", 1),
      onHidden: () => this.fakeHover(".nbp-presenter-toolbar", 0)
    }, {
      element: ".nbp-presenter-toolbar .fa-step-backward",
      title: "Go back",
      content: "Clicking here to go back to the previous slide",
      placement: "top",
      onShown: () => this.fakeHover(".nbp-presenter-toolbar", 1),
      onHidden: () => this.fakeHover(".nbp-presenter-toolbar", 0)
    }, {
      element: ".nbp-presenter-toolbar .fa-fast-backward",
      title: "Go back to the beginning",
      content: "Clicking here to go back to the first Slide",
      placement: "top",
      onShown: () => this.fakeHover(".nbp-presenter-toolbar", 1),
      onHidden: () => this.fakeHover(".nbp-presenter-toolbar", 0)
    }, {
      element: ".nbp-presenter-toolbar .fa-book",
      title: "My work is done here",
      content: "Click here to go back to the Notebook",
      placement: "top",
      onShown: () => this.fakeHover(".nbp-presenter-toolbar", 1),
      onHidden: () => [
        this.fakeHover(".nbp-presenter-toolbar", 0),
        this.mode.present(false)
      ]
    }]
  }
}
