import {d3} from "nbpresent-deps";

import {ManualLayout} from "../layout/manual";

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

    this.presenting = this.tree.select(["presenter", "presenting"]);
    this.current = this.tree.select(["presenter", "current"]);

    this.presenting.on("update", () => this.present());
    this.current.on("update", () => this.update());
  }

  makeCellManager() {
    throw new Error("Not implemented");
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_presenter: 1})
      .style({display: "none"});

    this.initToolbar();
  }

  toolbarIcons(){
    return [
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
      }]
    ];
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
      .datum(this.toolbarIcons())
      .call(toolbar.update);
  }

  layoutClass(){
    return ManualLayout;
  }

  present() {
    this.current.set(null);
    this.current.set(0);
  }

  getCells() {
    return this.cellManager.getCells();
  }

  update() {
    let that = this;
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

    let slide = this.tree.get("sortedSlides")[this.current.get()];

    // TODO: handle cleanup
    // transition = this.layout && this.layout.destroy()

    if(!slide){
      return this.current.set(0);
    }

    let LayoutClass = this.layoutClass();

    this.layout = new LayoutClass(slide);

    this.layout.resetScales(document.documentElement);

    let cells = this.getCells();

    d3.selectAll(this.allPartSelect())
      .classed({nbpresent_unpresent: 1, nbpresent_present: 0});

    d3.entries(slide.value.regions)
      .filter(({value}) => value.content)
      .map((region) => {
        let {content} = region.value,
          cell = cells[content.cell];

        if(!cell){
          return;
        }

        let $el = d3.select(cell.element[0]),
          part = $el.select(PART_SELECT[content.part]);

        part
          .classed({
            nbpresent_unpresent: 0,
            nbpresent_present: 1
          })
          .each(() => that.layout.update(region, part));
      });

    this.clean();
  }

  allPartSelect(){
    return d3.entries(PART_SELECT)
      .map(({value}) => `.cell ${value}`)
      .join(", ");
  }

  clean(force){
    let that = this;

    if(force){
      d3.selectAll(this.allPartSelect())
        .classed({nbpresent_unpresent: 1, nbpresent_present: 0});
    }

    d3.selectAll(".nbpresent_unpresent")
      .call(that.layout.clean)
      .classed({nbpresent_unpresent: 0, nbpresent_present: 0});
  }
}
