import d3 from "d3";
import Baobab from "baobab";

import Jupyter from "base/js/namespace";

import {Presenter} from "./presenter";
import {Sorter} from "./sorter";

class NBPresent {
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
    this.initStylesheet();
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

  initStylesheet() {
    d3.select("head")
      .selectAll("link#nbpresent-css")
      .data([1])
    .enter()
      .append("link")
      .attr({
        rel: "stylesheet",
        // TODO: figure out how to make this portable
        href: "/nbextensions/nbpresent/nbpresent.min.css"
      });
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

var nbpresent = () => {
  let nbp = new NBPresent();
}

export {nbpresent};
