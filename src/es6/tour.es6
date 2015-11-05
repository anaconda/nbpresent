import Tour from "bootstraptour";

import {PART} from "./parts";

class NbpresentTour {
  constructor(nbpresent) {
    this.nbpresent = nbpresent;

    let fake_hover = (selector, value) => d3.selectAll(selector).classed({
      fake_hover: value
    });

    this.tour = new Tour({
      reflex: true, // click on element to continue tour
      onStart: function() { console.log('tour started'); },
      orphan: true,
      steps: [
        {
          element: "#nbpresent_sorter_btn",
          title: "Thanks for using nbpresent",
          content: "You just activated the nbpresent Sorter! Click Next to take the tour"
        },
        {
          element: "#nbpresent_sorter_btn",
          title: "This is the nbpresent Sorter",
          content: "You can add, reorder and remix your slides into a great presentation"
        },
        {
          element: "#nbpresent_present_btn",
          title: "This is the nbpresent Presenter",
          content: "With the Presenter, you can view that presentation, tweak the content in-place, and publish it to the world. But first..."
        },
        {
          element: ".deck_toolbar .fa-plus-square-o",
          title: "This is the Deck Toolbar",
          content: "Let's create a new slide",
          onNext: () => this.nbpresent.sorter.addSlide()
        },
        {
          element: ".from_template",
          title: "Template Library",
          position: "top",
          content: "You can pick from some existing templates..."
        },
        {
          element: ".from_slide",
          title: "Reuse Slide as Template",
          position: "top",
          content: "Or copy an existing slide"
        },
        {
          element: ".nbpresent_layout_library .slide:nth-of-type(2)",
          title: "Simple Template",
          position: "top",
          content: "Let's use this one",
          onNext: () => this.nbpresent.sorter.layoutPicked(
            d3.select(".nbpresent_layout_library .slide:nth-of-type(2)")
              .datum()
          )
        },
        {
          element: ".slides_wrap .slide:last-child",
          placement: "top",
          title: "Look at the slide, just look at it",
          content: "Here's our new slide"
        },
        {
          element: ".slides_wrap .slide:last-child .region",
          placement: "left",
          title: "Region",
          onShow: () => {
            let el = d3.select(".slides_wrap .slide:last-child .region");
            el.on("click")(el.datum());
          },
          content: "It has one Region"
        },
        {
          element: ".region_toolbar .fa-external-link-square",
          placement: "top",
          title: "Cell Part",
          content: "You put a Part of a cell into a Region. The Parts are Inputs, like source code or Markdown..."
        },
        {
          element: ".region_toolbar .fa-external-link",
          placement: "top",
          title: "Cell Part: Outputs",
          content: "... the Outputs, such as calculations, tables and figures..."
        },
        {
          element: ".region_toolbar .fa-sliders",
          placement: "top",
          title: "Cell Part: Widgets",
          content: "...and interactive Widgets, including sliders and knobs."
        },
        {
          element: ".region_toolbar .fa-unlink",
          placement: "top",
          title: "Cell Part: Unlinking",
          content: "Since a Part can be linked to more than one Region, you might need to Unlink one."
        },
        {
          element: ".cell.selected",
          placement: "left",
          title: "Linking an Input Part",
          content: "Let's use this cell input"
        },
        {
          element: ".slides_wrap .slide:last-child .region",
          placement: "left",
          title: "Part Thumbnail",
          content: "A part thumbnail might look a little funny, but you should usually be able to get an idea of what you're seeing.",
          onShow: () => this.nbpresent.sorter.linkContent(PART.source)
        },
        {
          title: "Achievement Unlocked: Presentation",
          content: "We're ready to look at the presentation!"
        },
        {
          element: "#nbpresent_present_btn",
          title: "Great, let's have a look",
          content: "Clicking this button brings up the Presenter",
          onNext: () => this.nbpresent.present()
        },
        {
          title: "Looks great!",
          content: "Your slide is still made up of your notebook"
        },
        {
          element: ".nbpresent_present",
          placement: "top",
          title: "Same Notebook, Different Day",
          content: "This is an editable input area"
        },
        {
          element: ".nbpresent_present",
          placement: "top",
          title: "Part Execution",
          content: "Inputs can even be executed with keyboard shortcuts like Ctrl+Enter"
        },
        // ...
        {
          element: ".presenter_toolbar .fa-step-forward",
          title: "Go forward",
          content: "Click here to go to the next Slide",
          placement: "bottom",
          onShown: () => fake_hover(".presenter_toolbar", true),
          onHidden: () => fake_hover(".presenter_toolbar", 0)
        },
        {
          element: ".presenter_toolbar .fa-step-backward",
          title: "Go back",
          content: "Clicking here to go back to the previous slide",
          placement: "bottom",
          onShown: () => fake_hover(".presenter_toolbar", true),
          onHidden: () => fake_hover(".presenter_toolbar", 0)
        },
        {
          element: ".presenter_toolbar .fa-fast-backward",
          title: "Go back to the beginning",
          content: "Clicking here to go back to the first Slide",
          placement: "bottom",
          onShown: () => fake_hover(".presenter_toolbar", true),
          onHidden: () => fake_hover(".presenter_toolbar", 0)
        },
        {
          element: ".presenter_toolbar .fa-book",
          title: "My work is done here",
          content: "Click here to go back to the Notebook",
          placement: "bottom",
          onShown: () => fake_hover(".presenter_toolbar", true),
          onHidden: () => fake_hover(".presenter_toolbar", 0) &&
            this.nbpresent.unpresent()
        },
        {
          element: ".deck_toolbar .fa-edit",
          title: "Edit Slide",
          content: "If you need more control, you can edit a Slide's Regions directly",
          placement: "top",
          onHidden: () => this.nbpresent.sorter.editSlide(
            this.nbpresent.sorter.selectedSlide.get()
          )
        },
        {
          element: ".nbpresent_editor .slide_bg",
          placement: "top",
          title: "Region Editor",
          content: "This is the Region editor. You can click and drag Regions around and resize them."
        },
        {
          element: ".nbpresent_regiontree",
          placement: "right",
          title: "Region Tree",
          content: "This is the Region tree. It lets you reorder Regions and see the details of how your Regions will show their linked Parts."
        }
      ]
    });
  }

  init(){
    this.tour.init();
    return this;
  }

  start(){
    this.tour.start();
    return this;
  }

  restart(){
    this.tour.restart();
    return this;
  }
}

export {NbpresentTour as Tour};
