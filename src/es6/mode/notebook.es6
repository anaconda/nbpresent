import Jupyter from "base/js/namespace";
import {CellToolbar} from "notebook/js/celltoolbar";

import {d3, $} from "nbpresent-deps";

import {NotebookPresenter} from "../presenter/notebook";
import {Sorter} from "../sorter";
import {PART} from "../parts";
import {NbpresentTour} from "../tour";
import {Tree} from "../tree";

import {Mode as BaseMode} from "./base";

export class Mode extends BaseMode {
  init() {
    this.initStylesheet();

    let tree = new Tree({
      slides: this.metadata().slides,
      root: this.root
    });

    this.tree = tree.tree;

    this.slides = this.tree.select(["slides"]);
    this.slides.on("update", () => this.metadata(true))

    this.tour = new NbpresentTour(this);
    this.tour.init();

    this.presenter = new NotebookPresenter(this.tree, this.tour);
    this.sorter = new Sorter(this.tree, this.tour);

    this.initToolbar();
  }

  initStylesheet(){
    let css = d3.select("head")
      .selectAll("link#nbpresent-css")
      .data([1]);

    if(css.node()){
      console.warn("nbpresent extension already loaded!");
      return;
    }

    css.enter()
      .append("link")
      .attr({id: "nbpresent-css"})
      .attr({
        rel: "stylesheet",
        href: `${this.root}/nbpresent.min.css`
      });
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

  show(){
    this.sorter.show();
    this.tour.start();
    $('#header-container').toggle();
    $('.header-bar').toggle();
  }

  present(){
    this.presenter.presenting.set(true);
  }

  unpresent(){
    this.presenter.presenting.set(false);
  }

  initToolbar() {
    $("#view_menu").append($("<li/>").append($("<a/>")
      .text("Toggle Present")
      .on("click", ()=>{
        this.show();
      })));

    // TODO: make this one button!
    Jupyter.toolbar.add_buttons_group([
      {
        label: "Slide Sorter",
        icon: "fa-th-large",
        callback: () => this.show(),
        id: "nbpresent_sorter_btn"
      },
      {
        label: "Present",
        icon: "fa-youtube-play",
        callback: () => this.present(),
        id: "nbpresent_present_btn"
      }
    ]);
    let that = this;

    var nbpresent_preset = [];

    let add_to_region = (div, cell) => {
      let $div = d3.select(div[0]);

      $div.append("i").attr("class", "fa fa-link");

      $div.append("span").text(" Region ");

      let $btn = $div.selectAll(".btn")
        .data([PART.source, PART.outputs, PART.widgets])
        .enter()
        .append("button")
        .classed({btn: 1, "btn-default": 1, "btn-xs": 1})
        .text((d) => d)
        .on("click", (d) => that.sorter.linkContent(d));
    };

    CellToolbar.register_callback("nbpresent.add_to_region", add_to_region);
    nbpresent_preset.push("nbpresent.add_to_region");

    CellToolbar.register_preset("nbpresent", nbpresent_preset, Jupyter.notebook);

    // update the download chrome
    let dlMenu = d3.select(d3.select("#download_html").node().parentNode);

    dlMenu.insert("li", ":nth-child(4)")
      .append("a")
      .classed({download_nbpresent_html: 1})
      .text("Presentation (.html)")
      .on("click", () => this.nbconvert("nbpresent"));

    dlMenu.insert("li", ":nth-child(5)")
      .append("a")
      .classed({download_nbpresent_pdf: 1})
      .text("Presentation (.pdf)")
      .on("click", () => this.nbconvert("nbpresent_pdf"));

  }

  nbconvert(key){
    Jupyter.menubar._nbconvert(key, true);
  }
}
