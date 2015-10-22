import d3 from "d3";
import Baobab from "baobab";

import Jupyter from "base/js/namespace";

import {Presenter} from "./presenter";
import {Sorter} from "./sorter";

export class NBPresent {
  constructor() {
    this.tree = new Baobab({
      slides: this.metadata().slides,
      presenter: {},
      sorter: {},
      editor: {},
      sortedSlides: Baobab.monkey(["slides"], this.sortedSlides)
    });

    this.slides = this.tree.select(["slides"]);
    this.slides.on("update", () => this.metadata(true))

    this.presenter = new Presenter(this.tree);
    this.sorter = new Sorter(this.tree);

    this.initToolbar();
  }

  metadata(update){
    let md = Jupyter.notebook.metadata;
    if(update){
      md.nbpresent = {
        slides: this.slides.serialize()
      };
    }else{
      return md.nbpresent || {
        slides: {}
      }
    }
  }

  sortedSlides(slidesMap){
    let slides = d3.entries(slidesMap);

    slides.sort(
      (a, b) => (a.value.prev === null) || (a.key === b.value.prev) ? -1 : 1
    )

    return slides;
  }

  initToolbar() {
    Jupyter.toolbar.add_buttons_group([
      {
        label: "Slide Sorter",
        icon: "fa-th-large",
        callback: () => this.sorter.show(),
        id: "nbpresent_sorter_btn"
      },
      {
        label: "Present",
        icon: "fa-youtube-play",
        callback: () => this.tree.set(
          ["presenter", "presenting"],
          !this.tree.get(["presenter", "presenting"])
        ),
        id: "nbpresent_present_btn"
      }
    ]);
  }
}
