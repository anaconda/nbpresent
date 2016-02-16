import {BaseTome} from "./base";


/** import slideshow/RISE presentations */
export class BasicTome extends BaseTome {
  icon(){
    return "columns fa-rotate-270";
  }

  title(){
    return "Basic";
  }

  label(){
    return `${this.study().length} Slides`;
  }

  study(){
    let slides = [],
      prev;

    this.cells().map((cell) => {
      prev = slides.slice(-1)[0];
      slides.push(this.wholeCellSlide(cell, prev ? prev.id : null));
    });

    return slides;
  }
}
