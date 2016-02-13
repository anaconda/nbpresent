import Tour from "bootstraptour";


export class TourBase {
  constructor(mode) {
    this.mode = mode;
  }

  init(){
    let opts = this.options();
    opts.steps = this.steps();
    this.tour = new Tour(opts);
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

  end(){
    this.tour.end();
    return this;
  }

  options(){
    return {
      name: "nbpresent",
      reflex: true,
      duration: 5000,
      orphan: true,
    };
  }

  fakeHover(selector, value){
    d3.selectAll(selector).classed({"nbp-fake-hover": value});
  }
}
