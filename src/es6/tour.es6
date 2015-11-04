import Tour from "bootstraptour";

class NbpresentTour {
  constructor() {
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
        }
      ]
    });
  }

  init(){
    this.tour.init();
  }

  start(){
    this.tour.start();
  }
}

export {NbpresentTour as Tour};
