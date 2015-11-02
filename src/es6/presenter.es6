import d3 from "d3";

import Jupyter from "base/js/namespace";

import {Toolbar} from "./toolbar";
import {PARTS, PART_SELECT} from "./parts";

class Presenter {
  constructor(tree) {
    this.tree = tree;

    this.initUI();
    this.x = d3.scale.linear();
    this.y = d3.scale.linear();

    this.presenting = this.tree.select(["presenter", "presenting"]);
    this.current = this.tree.select(["presenter", "current"]);

    this.presenting.on("update", () => this.present());
    this.current.on("update", () => this.update());
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

    toolbar.btnClass("btn-invert");

    // TODO: Make this overlay (Jupyter-branded Reveal Compass)
    this.$toolbar = this.$ui.append("div")
      .datum([
        [{
          icon: "dedent",
          click: () => this.presenting.set(false)
        },
        {
          icon: "fast-backward",
          click: () => this.current.set(0)
        },
        {
          icon: "step-backward",
          click: () => this.current.set(this.current.get() - 1)
        },
        {
          icon: "step-forward",
          click: () => this.current.set(this.current.get() + 1)
        }]
      ])
      .call(toolbar.update);
  }

  present() {
    let presenting = this.presenting.get();
    this.$ui
      .style({
        "display": presenting ? "block" : "none"
      })
      .transition()
      .style({
        opacity: +presenting,
      });

    this.current.set(0);
    if(!presenting){
      this.clean(true);
    }
  }

  update() {
    if(!this.presenting.get()){
      return this.clean(true);
    }
    let {clientWidth, clientHeight} = document.documentElement;
    this.x.range([0, clientWidth]);
    this.y.range([0, clientHeight]);
    let slide = this.tree.get("sortedSlides")[this.current.get()];

    if(!slide){
      return this.current.set(0);
    }

    let cells = Jupyter.notebook.get_cells().reduce((memo, cell)=> {
        if(cell.metadata.nbpresent){
          memo[cell.metadata.nbpresent.id] = cell;
        }
        return memo;
      },{});

    d3.selectAll(this.allPartSelect())
      .classed({nbpresent_unpresent: 1, nbpresent_present: 0});

    d3.entries(slide.value.regions)
      .filter((region) => region.value.content)
      .map((region) => {
        let {content, x, y, width, height} = region.value,
          cell = cells[content.cell],
          $el = d3.select(cell.element[0]),
          part = $el.select(PART_SELECT[content.part]);

        part
          .classed({nbpresent_unpresent: 0, nbpresent_present: 1})
          .transition()
          .style({
        // TODO: do this with CSS3 transforms
        // TODO: add z
        // TODO: think about projections
            left: `${this.x(x)}px`,
            top: `${this.y(y)}px`,
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
        left: null,
        top: null,
        width: null,
        height: null
      })
      .classed({nbpresent_unpresent: 0, nbpresent_present: 0});
  }
}

export {Presenter};
