import d3 from "d3";
import uuid from "node-uuid";

import Jupyter from "base/js/namespace";

import {Editor} from "./editor";
import {Toolbar} from "./toolbar";

let REMOVED = "<removed>";

class Sorter {
  constructor(tree) {
    this.tree = tree;
    // TODO: put this in the tree
    this.visible = this.tree.select("visible");
    this.visible.set(false);

    this.$view = d3.select("#header")
      .append("div")
      .classed({
        nbpresent_sorter: 1,
        offscreen: 1
      });

    this.initToolbar();
    this.initDrag();

    this.$slides = this.$view.append("div")
      .classed({slides_wrap: 1});

    this.$empty = this.$slides.append("h3")
      .classed({empty: 1})
      .text("No slides yet.");

    this.slides = this.tree.select(["slides"]);
    this.selectedSlide = this.tree.select("selectedSlide");
    this.selectedRegion = this.tree.select("selectedRegion");

    this.selectedSlide.on("update", () => {
      let slide = this.selectedSlide.get();
      this.draw();
      if(this.editor){
        this.editSlide(slide);
      }
    });
    this.selectedRegion.on("update", () => {
      let region = this.selectedRegion.get();
      if(region){
        let content = this.slides.get(
          [region[0], "regions", region[1], "content"]);
        if(content){
          let cell = Jupyter.notebook.get_cells().filter(function(cell, idx){
            if(cell.metadata.slides && cell.metadata.slides.id == content.cell){
              Jupyter.notebook.select(idx);
            };
          });
        }
      }
      this.draw();
    });
    this.slides.on("update", () => this.draw());

    this.draw();
  }

  initDrag(){
    let that = this,
      dragOrigin;

    this.drag = d3.behavior.drag()
      .on("dragstart", function(d){
        let slide = d3.select(this)
          .classed({dragging: 1});

        dragOrigin = parseFloat(slide.style("top"));
      })
      .on("drag", function(d){
        d3.select(this)
          .style({
            top: `${dragOrigin += d3.event.dy}px`,
          });
      })
      .on("dragend", function(d, i){
        let $slide = d3.select(this)
          .classed({dragging: 0});

        let top = parseFloat($slide.style("top")),
          slides = that.sortedSlides(),
          slideN = Math.floor(top / that.slideHeight()),
          after;

        if(top < that.slideHeight() || slideN < 0){
          after = null;
        }else if(slideN > slides.length || !slides[slideN]){
          after = slides.slice(-1)[0].key;
        }else{
          after = slides[slideN].key;
        }

        if(d.key !== after){
          that.unlinkSlide(d.key);
          that.selectedSlide.set(that.appendSlide(after, d.key));
        }else{
          that.draw();
        }
      });
  }

  // put in tree?
  sortedSlides(){
    let slides = d3.entries(this.slides.get());

    slides.sort(
      (a, b) => (a.value.prev === null) || (a.key === b.value.prev) ? -1 : 1
    )

    return slides;
  }

  slideHeight() {
    return 100;
  }

  draw(){
    let that = this;

    let slides = this.sortedSlides();

    //console.table(slides.map(({value}) => value));

    let $slide = this.$slides.selectAll(".slide")
      .data(slides, (d) => d.key);

    $slide.enter().append("div")
      .classed({slide: 1})
      .call(this.drag)
      .on("mousedown", function(d){
        that.selectedSlide.set(
          that.selectedSlide.get() === d.key ? null : d.key
        );
      })
      .style({
        left: "200px"
      })
      .append("svg");

    $slide.exit()
      .transition()
      .style({
        left: "200px"
      })
      .remove();

    let selectedSlide = this.selectedSlide.get();

    $slide
      .style({
        "z-index": (d, i) => i
      })
      .classed({
        active: (d) => d.key === selectedSlide
      })
      .transition()
      .delay((d, i) => i * 10)
      .style({
        left: "0px",
        top: (d, i) => `${i * this.slideHeight()}px`
      });

    let $region = $slide.select("svg")
      .selectAll(".region")
      .data((slide) => d3.entries(slide.value.regions).map((region) => {
        return {slide, region};
      }))

    $region.enter()
      .append("rect")
      .classed({region: 1})
      .on("click", (d)=> this.selectedRegion.set([d.slide.key, d.region.key]));

    $region.exit()
      .remove();

    let sRegion = this.selectedRegion.get();

    $region
      .classed({
        active: (d) => {
          console.log(d.region.value);
          return sRegion &&
            d.slide.key == sRegion[0] &&
            d.region.key === sRegion[1];
        },
        content_source: (d) => d.region.value.content &&
          d.region.value.content.part === "source",
        content_output: (d) => d.region.value.content &&
          d.region.value.content.part === "output"
      })
      .attr({
        x: (d) => d.region.value.x * 160,
        y: (d) => d.region.value.y * 90,
        width: (d) => d.region.value.width * 160,
        height: (d) => d.region.value.height * 90,
      });

    this.$empty.style({opacity: 1 * !$slide[0].length });
  }


  initToolbar(){
    let toolbar = new Toolbar();
    this.$toolbar = this.$view.append("div")
      .datum([
        [{
          icon: "plus-square-o",
          on: {click: () => this.addSlide() }
        }],
        [{
          icon: "edit",
          on: {click: () => this.editSlide(this.selectedSlide.get()) }
        }],
        [{
          icon: "external-link-square",
          on: {click: () => this.linkContent("source")}
        },
        {
          icon: "external-link",
          on: {click: () => this.linkContent("output")}
        }],
        [{
          icon: "trash",
          on: {click: () => this.removeSlide(this.selectedSlide.get()) }
        }]
      ])
      .call(toolbar.update);
  }

  linkContent(part){
    let region = this.selectedRegion.get(),
      cell = Jupyter.notebook.get_selected_cell(),
      cellId;

    if(!(region && cell)){
      return;
    }

    if(!cell.metadata.slides){
      cell.metadata.slides = {id: this.nextId()};
    }

    cellId = cell.metadata.slides.id;

    this.slides.set([region[0], "regions", region[1], "content"], {
      cell: cellId,
      part
    });
  }

  addSlide(){
    let last = this.sortedSlides().slice(-1),
      selected = this.selectedSlide.get(),
      appended = this.appendSlide(
        selected ? selected : last.length ? last[0].key : null
      );
    this.selectedSlide.set(appended);
  }

  editSlide(id){
    if(this.editor){
      if(this.editor.slide.get("id") === id){
        id = null;
      }
      this.editor.destroy();
      this.editor = null;
    }

    if(!id){
      return;
    }
    // TODO: do this with an id and big tree ref?
    this.editor = new Editor(this.slides.select(id));
  }

  nextId(){
    return uuid.v4();
  }

  unlinkSlide(id){
    let {prev} = this.slides.get(id),
      next = this.nextSlide(id);

    next && this.slides.set([next, "prev"], prev);
    this.slides.set([id, "prev"], REMOVED);
  }

  removeSlide(id){
    if(!id){
      return;
    }
    this.unlinkSlide(id);
    this.slides.unset(id);
  }

  nextSlide(id){
    let slides = this.sortedSlides(),
      next = slides.filter((d) => d.value.prev === id);

    return next.length ? next[0].key : null;
  }

  newSlide(id, prev){
    return {
      id, prev,
      regions: {
      }
    }
  }

  appendSlide(prev, id=null){
    let next = this.nextSlide(prev);

    if(!id){
      id = this.nextId();
      this.slides.set(id, this.newSlide(id, prev));
    }else{
      this.slides.set([id, "prev"], prev);
    }

    next && this.slides.set([next, "prev"], id);

    return id;
  }

  show(){
    this.visible.set(!this.visible.get());
    this.update();
  }

  update(){
    let visible = this.visible.get();
    this.$view.classed({offscreen: !visible});
    d3.select("#notebook-container")
      .style({
        width: visible ? "auto" : null,
        "margin-right": visible ? "220px" : null,
        "margin-left": visible ? "20px" : null,
      });
  }
}

export {Sorter};
