import {d3} from "nbpresent-deps";

import {ManualLayout} from "../layout/manual";
import {TreemapLayout} from "../layout/treemap";

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
    this.current = this.tree.select(["selectedSlide"]);

    this.tree.on("update", () => this.update());
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
    let that = this;

    return [
      [{
        icon: "fast-backward",
        click: () => that.current.set(this.tree.get(["sortedSlides", 0, "key"])),
        tip: "Back to Start"
      }],
      [{
        icon: "step-backward",
        click: () => {
          let current = that.tree.get(["slides", this.current.get()]);
          this.current.set(current.prev);
        },
        tip: "Previous Slide"
      }],
      [{
        icon: "step-forward",
        click: () => {
          let slides = that.tree.get(["slides"]),
            current = slides[that.current.get()];

          d3.entries(slides).map((d)=> {
            if(d.value.prev === current.id){
              that.current.set(d.key);
            }
          });
        },
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

  layoutClass(slide){
    console.log("layoutClass", slide.value.layout);
    return {
      manual: ManualLayout,
      treemap: TreemapLayout
    }[slide.value.layout || "manual"];
  }

  updateLayout(slide){
    let LayoutClass = this.layoutClass(slide);

    console.log(this.layout && this.layout.slide.key);

    if(this.layout &&
      this.layout.key() == LayoutClass.clsKey() &&
      this.layout.slide.key === slide.key
    ){
      this.layout.slide = slide;
    }else{
      this.layout = new LayoutClass(
        this.tree,
        slide,
        document.documentElement
      );
    }
    this.layout.init();
  }

  present() {
    this.update();
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
      .style({
        opacity: +presenting,
      });

    let current = this.current.get(),
      slide = this.tree.get(["sortedSlides", (d) => d.key == current]);

    // TODO: handle cleanup
    // transition = this.layout && this.layout.destroy()

    if(!slide){
      return this.current.set(this.tree.get(["sortedSlides", 0, "key"]));
    }

    this.updateLayout(slide);

    if(!presenting){
      return this.clean(true);
    }

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
      .call(that.layout && this.layout.clean || () => 0)
      .classed({nbpresent_unpresent: 0, nbpresent_present: 0});
  }
}
