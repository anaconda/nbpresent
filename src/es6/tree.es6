import {Baobab, d3, $} from "nbpresent-deps";

export class Tree {
  constructor(obj){
    this.tree = new Baobab($.extend({
      slides: {},
      sortedSlides: Baobab.monkey(["slides"], this.sortedSlides),
      themes: {}
    }, obj));
  }

  sortedSlides(slidesMap){
    let slides = d3.entries(slidesMap);

    slides.sort(
      (a, b) => (a.value.prev === null) || (a.key === b.value.prev) ? -1 : 1
    )

    return slides;
  }
}
