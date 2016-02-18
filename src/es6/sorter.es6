import {_} from "underscore";
import {d3, uuid} from "nbpresent-deps";

import Jupyter from "base/js/namespace";

import {Editor} from "./editor";
import {Toolbar} from "./toolbar";
import {ICON} from "./icons";

import {MiniSlide} from "./mini";
import {TemplateLibrary} from "./templates/library";
import {NotebookCellManager} from "./cells/notebook";
import {LinkOverlay} from "./cells/overlay";

import {NotebookActions} from "./actions/notebook";

import {AriseTome} from "./tome/arise";
import {BasicTome} from "./tome/basic";

import {ThemeCard} from "./theme/card";

let REMOVED = "<removed>";

const MODE_NAMES = [
  "editor",
  "templates",
  "linkOverlay"
];


/** The main user experience for creating and reordering slides, as well as
  * defining the relationship between notebook cells {@link PART}s and slide
  * regions. Not available in {@link StandaloneMode} */
class Sorter {
  constructor(tree) {
    this.tree = tree;
    this.cellManager = new NotebookCellManager();

    this.cellManager.clearThumbnails();

    this.templatePicked = this.templatePicked.bind(this);

    this.slides = this.tree.select(["slides"]);
    this.themes = this.tree.select(["themes", "theme"]);
    this.selectedSlide = this.tree.select(["app", "selectedSlide"]);
    this.selectedRegion = this.tree.select(["app", "selectedRegion"]);

    this.selectedSlide.on("update", () => this.updateSelectedSlide());
    this.selectedRegion.on("update", () => this.updateSelectedRegion());
    this.slides.on("update", () => this.draw());

    this.scale = {
      x: d3.scale.linear()
    };

    this.mini = new MiniSlide(this.selectedRegion);

    this.drawn = false;

    this.tomes = [
      new BasicTome(this),
      new AriseTome(this)
    ];

    this.initUI()
      .initToolbar()
      .initDrag()
      .initActions()
      .draw();

    _.defer(() => this.$body.classed({"nbp-sorting": 1}));
  }

  initActions(){
    this.actions = new NotebookActions();
    this.actions.push();
    return this;
  }

  deinitActions(){
    this.actions && this.actions.pop();
    return this;
  }

  cleanup(){
    this.focusMode();
  }

  destroy(){
    d3.select("body")
      .classed({"nbp-sorting": 0});

    this.cleanup();
    this.deinitActions();
    this.$deckToolbar.remove();
    this.$themePicker && this.$themePicker.remove();
    d3.selectAll(".ui-tooltip").remove();
    this.destroyed = true;

    _.delay(() => this.$drawer.remove(), 200);
  }

  focusMode(except=[]){
    let mode;
    MODE_NAMES.map((name) => {
      mode = this[name];
      if(!mode || except.indexOf(name) !== -1){
        return;
      }
      mode.destroy();
      this[name] = null;
    });
    return this;
  }

  initUI(){
    this.$body = d3.select("body");

    this.$app = this.$body.select(".nbp-app");

    this.$drawer = this.$body.append("div")
      .classed({"nbp-sorter-drawer": 1});

    this.$ui = this.$drawer.append("div")
      .classed({"nbp-sorter": 1});

    this.$ui.append("h2")
      .classed({"nbp-sorter-label": 1})
      .text("Your Slides");

    this.$slides = this.$ui.append("div")
      .classed({"nbp-slides-wrap": 1});

    this.$empty = this.$ui.append("div")
      .classed({"nbp-sorter-empty": 1});

    this.$empty.append("div")
      .classed({"nbp-empty-intro": 1})
      .call((empty) => {
        empty.append("h2")
          .text("No Slides… yet!");

        empty.append("p")
          .call((p)=>{
            p.append("span")
              .text("You can create an empty slide by pressing ");
            p.append("a")
              .on("click", () => this.addSlide())
              .append("i").classed({"fa fa-plus-square-o fa-2x": 1});
            p.append("span")
              .text(" or by importing slides:");
          });
      });

    this.$empty.append("div")
      .classed({"nbp-tomes": 1});

    return this;
  }

  initDrag(){
    let that = this,
      origX,
      startY,
      startX,
      dx,
      dy, // eslint-disable-line no-unused-vars
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
      .on("dragstart", function(){
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

    return this;
  }

  // TODO: make these d3 scales!
  slideHeight() {
    return 100;
  }

  slideWidth(){
    return 180;
  }

  copySlide(slide, stripContent=true){
    let newSlide = JSON.parse(JSON.stringify(slide));
    newSlide.id = this.nextId();
    newSlide.regions = d3.entries(newSlide.regions).reduce((memo, d)=>{
      let id = this.nextId();
      // TODO: keep part?
      memo[id] = _.extend({}, d.value, {id},
        stripContent ? {content: null} : {}
      );
      return memo;
    }, {});

    return newSlide;
  }

  slideClicked(d){
    if(d.key){
      this.selectedSlide.set(d.key);
    }
    if(!(d.key) && !(this.templates)){
      this.templates = new TemplateLibrary(this.templatePicked);
      return;
    }

    if(this.templates){
      let newSlide = this.copySlide(d.value);
      this.templatePicked({key: newSlide.id, value: newSlide});
      this.focusMode();
      return;
    }
  }

  updateEmpty(){
    var tome = this.$empty.select(".nbp-tomes").selectAll(".nbp-tome")
      .data(this.tomes.filter((d) => d.relevant()))

    tome.enter()
      .append("div")
      .classed({"nbp-tome": 1})
      .call((tome) => {
        tome.append("h3")
          .text((d) => d.title());
        tome.append("button")
          .classed({btn: 1})
          .on("click", (d)=> d.execute())
          .call((btn)=>{
            btn.append("i")
              .attr("class", (d) => `fa fa-2x fa-${d.icon()}`);
            btn.append("span").text((d) => ` ${d.label()}`);
          });
      });

    tome.exit().remove();
  }

  draw(){
    if(!(this.$slides)){
      return;
    }

    let slides = this.tree.get("sortedSlides");

    this.$ui.classed({empty: !slides.length});

    if(!slides.length){
      this.updateEmpty();
    }

    this.scale.x.range([10, this.slideWidth()]);

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
        "z-index": (d, i) => i
      })
      .classed({
        active: (d) => d.key === selectedSlide
      })
      .transition()
      .style({
        left: (d, i) => {
          let left = this.scale.x(i);
          if(d.key === selectedSlide){
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
          left: `${selectedSlideLeft}px`
        })
        .call(this.regionToolbar.update);

    this.$deckToolbar.call(this.deckToolbar.update);

    return this;
  }

  updateSelectedRegion(){
    let {slide, region} = this.selectedRegion.get() || {};
    if(region){
      this.selectedSlide.set(slide);
      let content = this.slides.get(
        [slide, "regions", region, "content"]);
      if(content){
        this.selectCell(content.cell);
        this.cellManager.clearThumbnails([content]);
      }
    }
    return this.draw();
  }

  // TODO: move this to the cell manager?
  selectCell(id){
    Jupyter.notebook.get_cells().filter(function(cell, idx){
      if(cell.metadata.nbpresent && cell.metadata.nbpresent.id == id){
        Jupyter.notebook.select(idx);
        Jupyter.notebook.scroll_to_cell(idx);
      }
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
      .btnClass("btn-default btn-lg")
      .tipOptions({container: "body", placement: "top"});

    this.$deckToolbar = this.$app.append("div")
      .classed({"nbp-deck-toolbar": 1})
      .datum([
        [{
          icon: "plus-square-o fa-2x fa-fw",
          click: () => this.addSlide(),
          label: "+ Slide"
        }], [{
          icon: [
            "square-o fa-stack-2x",
            `${ICON.themer} fa-stack-1x`
          ],
          click: () => this.pickTheme(),
          label: "Theme",
          visible: () => this.selectedSlide.get()
        }], [{
          icon: "chevron-circle-down fa-2x fa-fw",
          click: () => this.editSlide(),
          label: "Leave",
          visible: () => this.editor
        }, {
          icon: `${ICON.editor} fa-2x fa-fw`,
          click: () => this.editSlide(),
          label: "Edit",
          visible: () => this.selectedSlide.get() && !(this.editor)
        }],
        [{
          icon: [
            "square-o fa-stack-2x",
            `${ICON.trash} fa-stack-1x`
          ],
          click: () => {
            this.removeSlide(this.selectedSlide.get());
            this.selectedSlide.set(null);
          },
          label: "- Slide",
          visible: () => this.selectedSlide.get()
        }]
      ])
      .call(this.deckToolbar.update);

    this.regionToolbar = new Toolbar();

    this.$regionToolbar = this.$slides.append("div")
      .classed({"nbp-region-toolbar": 1})
      .datum([
        [{
          icon: ICON.link,
          click: () => this.linkContentOverlay(),
          label: "Link"
        },{
          icon: ICON.unlink,
          click: () => this.linkContent(null),
          label: "Unlink",
          visible: () => {
            let selected = this.selectedRegion.get();
            if(!selected){
              return;
            }
            return this.slides.get([
              selected.slide, "regions", selected.region, "content"]);
          }
        }],
        [{
          icon: ICON.trash,
          click: () => this.destroyRegion(),
          label: "- Region"
        }]
      ])
      .call(this.regionToolbar.update);

    return this;
  }

  pickTheme(){
    if(this.$themePicker){
      this.$themePicker.remove();
      delete this.$themePicker;
      return;
    }

    // TODO: options
    this.themeCard = new ThemeCard();

    this.$themePicker = this.$body.append("div")
      .classed({"nbp-slide-theme-picker": 1});

    let themes = this.themes.get() || {},
      theme = this.$themePicker.selectAll(".nbp-slide-theme-picker-theme")
        .data([{key: null, value: {}}].concat(d3.entries(themes)));

    theme.enter().append("div")
      .classed({"nbp-slide-theme-picker-theme": 1})
      .on("click", () => this.$themePicker.remove())
      .on("mouseover", ({key}) => {
        this.slides.set([this.selectedSlide.get(), "theme"], key);
      });

    theme.exit().remove();

    this.themeCard.update(theme);
  }

  cellId(cell){
    if(!cell.metadata.nbpresent){
      cell.metadata.nbpresent = {id: this.nextId()};
    }

    return cell.metadata.nbpresent.id;
  }

  linkContentOverlay(){
    if(this.linkOverlay){
      this.linkOverlay.destroy();
      this.linkOverlay = null;
    }else{
      this.focusMode(["linkOverlay"]);
      this.linkOverlay = new LinkOverlay(
        this.cellManager,
        ({part, cell}) => {
          this.linkContent(part, cell);
          this.linkContentOverlay();
        }
      );

      if(this.editor){
        this.editor.destroy();
        delete this.editor;
      }
      this.tree.set(["app", "presenting"], false);
    }
  }

  /** Link the currently selected region to a cell part
    * @param {String} part - one of {@link PART}
    * @param {Cell} cell - a Jupyter notebook cell
    * @return {Sorter} */
  linkContent(part, cell){
    let {slide, region} = this.selectedRegion.get() || {},
      cellId;

    cell = cell || Jupyter.notebook.get_selected_cell();

    if(!(region && cell)){
      return this;
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
    return this;
  }

  /** Destroy the currently selected region utterly
    * @return {Sorter} */
  destroyRegion(){
    let {slide, region} = this.selectedRegion.get() || {};
    if(!region){
      return;
    }
    this.slides.unset([slide, "regions", region]);
    this.selectedRegion.unset();
    return this;
  }

  addSlide(){
    if(!(this.templates) || this.templates.killed){
      this.templates = new TemplateLibrary(this.templatePicked);
    }else{
      this.focusMode();
    }
  }

  /** Handle a slide template click (either from library or sorter)
    * @param {Object} slide - the slide key, value to use
  */
  templatePicked(slide){
    if(slide && this.templates && !(this.templates.killed)){
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
    this.focusMode();
  }

  editSlide(id){
    id = id ? id : this.selectedSlide.get();

    if(this.editor){
      if(this.editor.slide.get("id") === id){
        id = null;
      }
      this.focusMode();
    }

    if(id){
      this.focusMode(["editor"]);
      // TODO: do this with an id and big tree ref?
      this.editor = new Editor(this.slides.select([id]), this.selectedRegion);
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
