import Tour from "bootstraptour";

class NbpresentTour {
  constructor(nbpresent) {
    this.nbpresent = nbpresent;

    let fake_hover = (selector, value) => d3.selectAll(selector).classed({
      fake_hover: value
    });

    this.tour = new Tour({
      storage: false, // start tour from beginning every time
      reflex: true, // click on element to continue tour
      animation: false,
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
        // ...
        {
          element: "#nbpresent_present_btn",
          title: "Great, let's have a look",
          content: "Clicking this button brings up the Presenter",
          onNext: () => this.nbpresent.present()
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
