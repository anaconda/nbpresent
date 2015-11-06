import {d3} from "nbpresent-deps";

import {CellManager} from "../cells/runtime";
import {Toolbar} from "../toolbar";
import {PARTS, PART_SELECT} from "../parts";

let PREFIX = [
  "-webkit-",
  "-moz-",
  "-ms-",
  "-o-",
  ""
];

export class Presenter {
  constructor(tree) {
    this.tree = tree;

    this.cellManager = this.makeCellManager();

    this.initUI();
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();

    this.presenting = this.tree.select(["presenter", "presenting"]);
    this.current = this.tree.select(["presenter", "current"]);

    this.presenting.on("update", () => this.present());
    this.current.on("update", () => this.update());
  }

  makeCellManager() {
    return new CellManager();
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_presenter: 1})
      .style({display: "none"});

    this.initToolbar();
  }


  initToolbar(){
    let toolbar = new Toolbar();

    toolbar
      .btnGroupClass("btn-group-vertical")
      .btnClass("btn-invert btn-lg")
      .tipOptions({container: "body", placement: "bottom"});

    // TODO: Make this overlay (Jupyter-branded Reveal Compass)
    this.$toolbar = this.$ui.append("div")
      .classed({presenter_toolbar: 1})
      .datum([
        [{
            icon: "fast-backward",
            click: () => this.current.set(0),
            tip: "Back to Start"
          },
        ],
        [{
          icon: "step-backward",
          click: () => this.current.set(this.current.get() - 1),
          tip: "Previous Slide"
        }],
        [{
          icon: "step-forward",
          click: () => this.current.set(this.current.get() + 1),
          tip: "Next Slide"
        }],
        [{
          icon: "book",
          click: () => this.presenting.set(false),
          tip: "Back to Notebook"
        }]
      ])
      .call(toolbar.update);
  }

  present() {
    this.current.set(null);
    this.current.set(0);
  }

  getCells() {
    return this.cellManager.getCells();
  }

  update() {
    let presenting = this.presenting.get();

    this.$ui
      .style({
        "display": presenting ? "block" : "none"
      })
      .transition()
      .style({
        opacity: +presenting,
      });

    if(!presenting){
      return this.clean(true);
    }

    let {clientWidth, clientHeight} = document.documentElement;
    this.x.range([0, clientWidth]);
    this.y.range([0, clientHeight]);
    let slide = this.tree.get("sortedSlides")[this.current.get()];

    if(!slide){
      return this.current.set(0);
    }

    let cells = this.getCells();

    d3.selectAll(this.allPartSelect())
      .classed({nbpresent_unpresent: 1, nbpresent_present: 0});

    d3.entries(slide.value.regions)
      .filter((region) => region.value.content)
      .map((region) => {
        let {content, x, y, width, height} = region.value,
          cell = cells[content.cell];

        if(!cell){
          return;
        }

        let $el = d3.select(cell.element[0]),
          part = $el.select(PART_SELECT[content.part]);

        part
          .classed({nbpresent_unpresent: 0, nbpresent_present: 1})
          .style({
            transform: `translate(${this.x(x)}px, ${this.y(y)}px) translateZ(0)`,
            left: `0`,
            top: `0`,
            width: `${this.x(width)}px`,
            height: `${this.y(height)}px`
          });
      });

    this.clean();
  }

  allPartSelect(){
    return d3.entries(PART_SELECT)
      .map(({value}) => `.cell ${value}`)
      .join(", ");
  }

  clean(force){
    if(force){
      d3.selectAll(this.allPartSelect())
        .classed({nbpresent_unpresent: 1, nbpresent_present: 0});
    }
    d3.selectAll(".nbpresent_unpresent")
      .style({
        transform: null,
        left: null,
        top: null,
        width: null,
        height: null
      })
      .classed({nbpresent_unpresent: 0, nbpresent_present: 0});
  }
}
