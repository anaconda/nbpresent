import {d3, uuid} from "nbpresent-deps";

import Jupyter from "base/js/namespace";

import {Editor} from "./editor";
import {Toolbar} from "./toolbar";
import {PART, PART_SELECT} from "./parts";
import {MiniSlide} from "./mini";
import {TemplateLibrary} from "./templates";

import {AriseTome} from "./tome/arise";

let REMOVED = "<removed>";

class Sorter {
  constructor(tree, tour, parentMode) {
    this.tree = tree;
    this.tour = tour;
    this.parentMode = parentMode;

    this.templatePicked = this.templatePicked.bind(this);

    this.visible = this.tree.select(["sorting"]);
    this.visible.set(false);

    this.slides = this.tree.select(["slides"]);
    this.selectedSlide = this.tree.select(["selectedSlide"]);
    this.selectedRegion = this.tree.select(["sorter", "selectedRegion"]);

    this.selectedSlide.on("update", () => this.updateSelectedSlide());
    this.selectedRegion.on("update", () => this.updateSelectedRegion());
    this.slides.on("update", () => this.draw());
    this.visible.on("update", () => this.visibleUpdated());

    this.scale = {
      x: d3.scale.linear()
    };

    this.mini = new MiniSlide(this.selectedRegion);

    this.drawn = false;

    this.tomes = [new AriseTome(this)];
  }

  visibleUpdated(){
    let visible = this.visible.get();

    if(!this.drawn){
      this.initUI();
      this.drawn = true;
    }

    if(visible) {
      this.draw();
    }else {
      if(this.editor){
        this.editor.destroy();
        this.editor = null;
      }
      if(this.templates){
        this.templates.destroy();
        this.templates = null;
      }
    }

    this.update();
  }

  show(){
    this.visible.set(!this.visible.get());
  }

  update(){
    let visible = this.visible.get();
    this.$view
      .classed({offscreen: !visible});
  }

  initUI(){
    this.$view = d3.select("body")
      .append("div")
      .classed({
        nbpresent_sorter: 1,
        offscreen: 1
      });

    this.$slides = this.$view.append("div")
      .classed({slides_wrap: 1});

    let $brand = this.$view.append("h4")
      .classed({nbpresent_brand: 1})
      .append("a")
      .attr({
        href: "https://anaconda-server.github.io/nbpresent/",
        target: "_blank"
      });

    $brand.append("i")
      .attr("class", "fa fa-fw fa-gift");

    $brand.append("span")
      .text("nbpresent");


    let $help = this.$view.append("div")
      .classed({nbpresent_help: 1})
      .append("a")
      .attr({href: "#"})
    .on("click", () => this.tour.restart())
      .append("i")
      .attr("class", "fa fa-question-circle");

    this.$empty = this.$view.append("div")
      .classed({sorter_empty: 1});

    this.$empty.append("h1")
      .text("no nbpresent slides yet");

    this.initToolbar();
    this.initDrag();
  }

  initDrag(){
    let that = this,
      origX,
      origY,
      startY,
      startX,
      dx,
      dy,
      newX,
      m,
      it,
      bb,
      threshold = 10,
      body = d3.select("body").node(),
      mouse = () => d3.mouse(body);

    function updateD(){
      m = mouse();
      dx = m[0] - startX;
      dy = m[1] - startY;
      newX = origX + dx;
    }

    this.drag = d3.behavior.drag()
      .on("dragstart", function(d){
        it = d3.select(this);
        origX = parseFloat(it.style("left"));
        m = mouse();
        startX = m[0];
        startY = m[1];
      })
      .on("drag", (d) => {
        updateD();
        if(!d.key || Math.abs(dx) < threshold){
          it.classed({dragging: 0})
          return;
        }
        it.classed({dragging: 1})
          .style({left: `${newX}px`});
      })
      .on("dragend", (d) => {
        updateD();
        it.classed({dragging: 0});
        if(!d.key || Math.abs(dx) < threshold){
          return;
        }

        let replaced = false;
        this.$slides.selectAll(".slide")
          .each(function(other){
            if(replaced || other.key == d.key){
              return;
            }
            bb = this.getBoundingClientRect();
            m = d3.mouse(this);
            if(m[0] > 0 && m[0] < bb.width && m[1] > 0 && m[1] < bb.height){
              that.unlinkSlide(d.key);
              that.selectedSlide.set(that.appendSlide(other.key, d.key));
              replaced = true;
            }
          });
      });
  }

  // TODO: make these d3 scales!
  slideHeight() {
    return 100;
  }

  slideWidth(){
    return 200;
  }

  copySlide(slide, stripContent=true){
    let newSlide = JSON.parse(JSON.stringify(slide));
    newSlide.id = this.nextId();
    newSlide.regions = d3.entries(newSlide.regions).reduce((memo, d)=>{
      let id = this.nextId();
      // TODO: keep part?
      memo[id] = $.extend(true, {}, d.value, {id},
        stripContent ? {content: null} : {}
      );
      return memo;
    }, {});

    return newSlide;
  }

  slideClicked(d){
    if(!d.key && !this.templates){
      this.templates = new TemplateLibrary(this.templatePicked);
      return;
    }

    if(this.templates){
      let newSlide = this.copySlide(d.value);
      this.templatePicked({key: newSlide.id, value: newSlide});
      this.templates && this.templates.destroy();
      this.templates = null;
      return;
    }
  }

  updateEmpty(){
    var tome = this.$empty.selectAll(".tome")
      .data(this.tomes);

    tome.enter()
      .append("div")
      .classed({tome: 1})
      .call((tome) => {
        tome.append("h3");
        tome.append("button")
          .classed({btn: 1})
          .text("import")
          .on("click", (d)=> d.execute());
      });

    tome.select("h3").text((d)=> d.name());

    tome.exit().remove();
  }

  draw(){
    if(!this.$slides){
      return;
    }
    let that = this;

    let slides = this.tree.get("sortedSlides");

    this.$view.classed({empty: !slides.length});

    if(!slides.length){
      this.updateEmpty();
      slides = [{value: {}}];
    }else{
      slides = [{value: {}}].concat(
        slides,
        [{value: {prev: slides.slice(-1)[0].key}}
      ]);
    }

    this.scale.x.range([20, this.slideWidth() + 20]);

    let $slide = this.$slides.selectAll(".slide")
      .data(slides, (d) => `${d.key}:${d.value.prev}`);

    $slide.enter().append("div")
      .classed({slide: 1})
      .call(this.drag)
      .on("click", (d) => this.slideClicked(d))
      .on("dblclick", (d) => this.editSlide(d.key));

    $slide.exit().remove();

    let selectedSlide = this.selectedSlide.get(),
      selectedRegion = this.selectedRegion.get(),
      selectedSlideLeft;

    $slide
      .style({
        "z-index": (d, i) => i,
        top: (d, i) => {
          // TODO: handle subslides
          return "50%";
        }
      })
      .classed({
        active: (d) => d.key === selectedSlide
      })
      .transition()
      .style({
        left: (d, i) => {
          let left = this.scale.x(i);
          if(d.key === selectedSlide){
            this.$slides.transition()
              .style({
                left: `${document.documentElement.clientWidth / 2 - left}px`
              })
            selectedSlideLeft = left;
          }
          return `${left}px`;
        }
      });


    $slide.call(this.mini.update);

    this.$regionToolbar
      .style({
        opacity: selectedRegion ? 1 : 0,
        display: selectedRegion ? "block" : "none",
        left: `${selectedSlideLeft - 30}px`,
        top: "50%",
        "margin-top": "-45px"
      });

    this.$deckToolbar.call(this.deckToolbar.update);
  }

  updateSelectedRegion(){
    let {slide, region} = this.selectedRegion.get() || {};
    if(region){
      this.selectedSlide.set(slide);
      let content = this.slides.get(
        [slide, "regions", region, "content"]);
      if(content){
        this.selectCell(content.cell);
      }
    }
    this.draw();
  }

  // TODO: move this to the cell manager?
  selectCell(id){
    let cell = Jupyter.notebook.get_cells().filter(function(cell, idx){
      if(cell.metadata.nbpresent && cell.metadata.nbpresent.id == id){
        Jupyter.notebook.select(idx);
      };
    });
  }

  updateSelectedSlide(){
    let slide = this.selectedSlide.get(),
      selected = this.selectedRegion.get() || {};

    if(selected.slide != slide){
      this.selectedRegion.set(null);
    }

    this.draw();
    if(this.editor){
      this.editSlide(slide);
    }
  }


  initToolbar(){
    this.deckToolbar = new Toolbar()
      .btnClass("btn-default btn-lg");
    this.$deckToolbar = this.$view.append("div")
      .classed({deck_toolbar: 1})
      .datum([
        [{
          icon: "plus-square-o fa-2x",
          click: () => this.addSlide(),
          tip: "Add Slide"
        }], [{
          icon: "edit fa-2x",
          click: () => this.editSlide(this.selectedSlide.get()),
          tip: "Edit Slide",
          visible: () => this.selectedSlide.get() && !this.editor
        }, {
          icon: "chevron-circle-down fa-2x",
          click: () => this.editSlide(this.selectedSlide.get()),
          tip: "Back to Sorter",
          visible: () => this.editor
        }, {
          icon: "book fa-2x",
          click: () => this.show(),
          tip: "Back to Notebook"
        }, {
          icon: "youtube-play fa-2x",
          click: () => {
            this.parentMode.present();
          },
          tip: "Present"
        }],
        [{
          icon: "trash fa-2x",
          click: () => {
            this.removeSlide(this.selectedSlide.get());
            this.selectedSlide.set(null);
          },
          tip: "Delete Slide",
          visible: () => this.selectedSlide.get()
        }]
      ])
      .call(this.deckToolbar.update);

    this.regionToolbar = new Toolbar();
    this.$regionToolbar = this.$slides.append("div")
      .classed({region_toolbar: 1})
      .datum([
        [{
          icon: "link",
          click: () => this.linkContentMode(),
          tip: "Link Region to Cell (Part)"
        },
        {
          icon: "unlink",
          click: () => this.linkContent(null),
          tip: "Unlink Region"
        }]
      ])
      .call(this.regionToolbar.update);
  }

  cellId(cell){
    if(!cell.metadata.nbpresent){
      cell.metadata.nbpresent = {id: this.nextId()};
    }

    return cell.metadata.nbpresent.id;
  }

  linkContentMode(){
    let wasLinking = this.$view.classed("linking"),
      inputs = d3.selectAll(".inner_cell"),
      outputs = d3.selectAll(".cell > .output_wrapper"),
      widgets = d3.selectAll(".cell > .widget-area");

    this.$view
      .classed({linking: !wasLinking});

    this.$linkOverlay = this.$linkOverlay || d3.select("body")
      .append("div")
      .classed({"nbpresent-sorter-link-overlay": 1});

    if(wasLinking){
      d3.select(window).on("mousemove.nbpresent-sorter-linking", null);
      this.$linkOverlay.remove();
      this.$linkOverlay = null;
      return;
    }

    d3.select(window).on("mousemove.nbpresent-sorter-linking", ()=>{
      Jupyter.notebook.get_cells().some((cell)=>{
        let part,
          el,
          cellect = d3.select(cell.element[0]),
          parts = {
            source: cellect.select(PART_SELECT.source).node(),
            outputs: cellect.select(PART_SELECT.outputs).node(),
            widgets: cellect.select(PART_SELECT.widgets).node()
          };

        if(parts.source && parts.source.contains(d3.event.target)){
          part = PART.source;
        }else if(parts.outputs && parts.outputs.contains(d3.event.target)){
          part = PART.outputs;
        }else if(parts.widgets && parts.widgets.contains(d3.event.target)){
          part = PART.widgets;
        }

        el = parts[part];

        if(part && el){
          let bb = el.getBoundingClientRect();
          this.$linkOverlay
            .style({
              left: `${bb.left}px`,
              top: `${bb.top}px`,
              width: `${bb.width}px`,
              height: `${bb.height}px`,
            })
            .on("click", ()=> {
              this.linkContent(part, cell);
              this.linkContentMode();
            });
          return true;
        }
      })
    });
  }


  linkContent(part, cell){
    let {slide, region} = this.selectedRegion.get() || {},
      cellId;

    cell = cell || Jupyter.notebook.get_selected_cell();

    if(!(region && cell)){
      return;
    }

    if(part){
      cellId = this.cellId(cell);

      this.slides.set([slide, "regions", region, "content"], {
        cell: cellId,
        part
      });
    }else{
      this.slides.unset([slide, "regions", region, "content"]);
    }
  }

  addSlide(){
    if(!this.templates || this.templates.killed){
      this.templates = new TemplateLibrary(this.templatePicked);
    }else{
      this.templates.destroy();
      this.templates = null;
    }
  }

  /** Handle a slide template click (either from library or sorter)
    * @param {Object} slide - the slide key, value to use
    * @param {String} [prev] - where to insert the slide, or after selected
  */
  templatePicked(slide, prev=null){
    if(slide && this.templates && !this.templates.killed){
      let last = this.tree.get("sortedSlides").slice(-1),
        selected = this.selectedSlide.get();

      // actually updates the Baobab cursor.
      this.slides.set([slide.key], slide.value);

      let appended = this.appendSlide(
          selected ? selected : last.length ? last[0].key : null,
          slide.key
        );

      this.selectedSlide.set(appended);
    }
    if(this.templates){
      this.templates.destroy();
      this.templates = null;
    }
  }

  editSlide(id){
    if(this.editor){
      if(this.editor.slide.get("id") === id){
        id = null;
      }
      this.editor.destroy();
      this.editor = null;
    }

    if(id){
      // TODO: do this with an id and big tree ref?
      this.editor = new Editor(this.slides.select(id), this.selectedRegion);
    }
    this.draw();
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
    let slides = this.tree.get("sortedSlides"),
      next = slides.filter((d) => d.value.prev === id);

    return next.length ? next[0].key : null;
  }

  newSlide(id, prev){
    return {
      id,
      prev,
      regions: {}
    }
  }

  /** Fix up the order of the slides linked list
    * @param {String} [prev] - after what slide to insert the slide, or
    *        or the beginning
    * @param {String} [id] - the new id value to use, or create a slide
    */
  appendSlide(prev=null, id=null){
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
}

export {Sorter};
