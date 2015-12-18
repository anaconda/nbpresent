import {d3} from "nbpresent-deps";

import {PART} from "./parts";

import {RegionTree} from "./regiontree";
import {NotebookCellManager} from "./cells/notebook";

import {bbox} from "./d3.bbox";



/** The visual editor overlay for drag-and-drop positioning of slide regions.
  */
export class Editor {
  /** Make a new Editor.
    * @param {baobab.Cursor} slide - the slide to edit
    * @param {object} selectedRegion - the slide id and region id
    * @listens {/slides/{slide}}  */
  constructor(slide, selectedRegion) {
    /** whether this Editor has been killed.
      * @type {bool} */
    this.killed = false;

    /** cursor pointed at a specific slide.
      * @type {baobab.Cursor} */
    this.slide = slide;

    /** the currently selected region
      * @type {object}
      * @property {string} selectedRegion.region
      * @property {string} selectedRegion.slide */
    this.selectedRegion = selectedRegion;

    /** a sub-cursor for just region changes
      * @type {baobab.Cursor} */
    this.regions = this.slide.select("regions");

    /** handles bookkeeping with the browser
      * @type {NotebookCellManager} */
    this.cellManager = new NotebookCellManager();

    // TODO: make these discrete to base unit
    /** the relative size to screen width transfer function
      * @type {d3.scale} */
    this.x = d3.scale.linear();

    /** the relative size to screen height transfer function
      * @type {d3.scale} */
    this.y = d3.scale.linear();

    // ready to init
    this.initUI();

    // TODO: move this?
    /** sub-ui for editing regions
      * @type {RegionTree} */
    this.sidebar = new RegionTree(this.slide, this.selectedRegion);

    // ready to behave
    this.initBehavior();

    // fake data event
    this.update();

    // subscribe to event when cursor changes
    this.slide.on("update", ()=> { this.killed || this.update(); });
  }

  /**
   * Destroy the editor and its children utterly.
   */
  destroy() {
    this.sidebar.destroy();
    this.$ui.transition()
      .style({opacity: 0})
      .remove();

    this.killed = true;
  }


  /**
   * Create d3 behaviors.
   * @return {Editor}
   */
  initBehavior(){
    /** @type {d3.bbox} */
    this.bbox = bbox();

    return this;
  }

  /**
   * Create all UI chrome.
   * @return {Editor}
   */
  initUI(){
    /** @type {d3.selection} */
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_editor: 1})
      .style({opacity: 0});

    /** @type {d3.selection} */
    this.$bg = this.$ui.append("div")
      .classed({slide_bg: 1});

    /** @type {d3.selection} */
    this.$svg = this.$bg.append("svg");

    /** @type {d3.selection} */
    this.$defs = this.$svg.append("defs");

    this.$ui.transition()
      .style({opacity: 1});

    return this;
  }


  /**
   * A stand-in for themed padding
   * @return {Number}
   */
  padding(){
    return 20;
  }


  /**
   * A stand-in for themed aspect ratio
   * @return {Number}
   */
  aspectRatio(){
    // TODO: put in data
    return 16 / 9;
  }

  /**
   * The "end" event of the d3.bbox control.
   * @param {Element} el - the DOM element (usually `this` in d3 callbacks)
   * @param {Object} d - the datum for the element
   */
  bbEnd(el, d){
    let $el = d3.select(el),
      scales = {
        x: this.x,
        y: this.y,
        width: this.x,
        height: this.y
      };

    let selected = this.selectedRegion.get();

    if(!selected){
      return;
    }

    this.slide.merge(["regions", selected.region, "attrs"],
      d3.entries(scales)
        .reduce((memo, attr) => {
          memo[attr.key] = attr.value.invert($el.attr(attr.key));
          return memo;
        }, {}));
  }

  /**
   * A d3 filter factory that determines whether a region contains a part of a
   * part type.
   * @param {PART_SELECT} part - the type of part to seek
   * @return {bool}
   */
  hasContent(part){
    return (d) => (d.value.content || {}).part === part;
  }

  /**
   * The main tree callback.
   */
  update(){
    // TODO: this really needs to be refactored.
    let that = this,
      uibb = this.$ui.node().getBoundingClientRect(),
      width = uibb.width - (this.sidebar.width() + (2 * this.padding())),
      height = width / this.aspectRatio(),
      regions = d3.entries(this.regions.get()),
      {slide, region} = this.selectedRegion.get() || {},
      selected = this.selectedRegion.get();

    if(height > uibb.height + 2 * this.padding()){
      height = uibb.height - (2 * this.padding());
      width = height * this.aspectRatio();
    }

    this.x.range([0, width]);
    this.y.range([0, height]);
    let {x, y} = this;

    this.$bg.style({
      left: `${(((uibb.width + this.sidebar.width()) - width) / 2)}px`,
      top: `${(uibb.height - height) / 2}px`,
      width: `${width}px`,
      height: `${height}px`
    });

    this.$svg.attr({width, height});

    regions.sort((a, b) => {
      return (selected && selected.region == a.key) ? -1 :
        (selected && selected.region == b.key) ? 1 :
          (a.value.attrs.z || 0) - (b.value.attrs.z || 0)
    });

    let $region = this.$svg.selectAll(".region")
      .data(regions, (d) => d.key)
      .order();

    $region.exit().remove();

    let regionData = (region) => {
      return directions.map((dir) => {
        return {region, dir};
      })
    };

    $region.enter()
      .append("g")
      .classed({"region": 1})
      .call(($region) => {
        $region.append("rect")
          .classed({region_bg: 1})
          .each(function(d){
            that.bbox.infect(d3.select(this))
              .on("dragend", function(d){ that.bbEnd(this, d) })
              .on("resizeend", function(d){ that.bbEnd(this, d) });
          });
      })
      .on("mousedown", (d) => {
        this.selectedRegion.set({slide: this.slide.get("id"), region: d.key});
      });

    $region
      .classed({
        active: (d) => selected && (d.key == selected.region),
        content_source: this.hasContent(PART.source),
        content_outputs: this.hasContent(PART.outputs),
        content_widgets: this.hasContent(PART.widgets)
      })
    .select(".region_bg")
      .transition()
      .attr({
        width: (d) => x(d.value.attrs.width),
        height: (d) => y(d.value.attrs.height),
        x: (d) => x(d.value.attrs.x),
        y: (d) => y(d.value.attrs.y)
      });

    $region.filter(({value}) => !value.content)
      .select(".region_bg")
      .style({fill: null});


    $region.filter(({value}) => value.content)
      .each(function(d){
        let $region = d3.select(this);
        that.cellManager.thumbnail(d.value.content)
          .catch(function(err){
            console.warn("thumbnail error", err);
          })
          .then(function({uri, width, height}){
            let id = `${d.value.content.part}-${d.value.content.cell}`,
              bg = that.$defs.selectAll(`#${id}`).data([id]);

            bg.enter().append("pattern")
              .attr({
                patternUnits: "userSpaceOnUse",
                id
              })
            .append("image")
              .attr({
                x: 0,
                y: 0
              });

            bg.attr({width, height})
              .select("image")
              .attr({
                "xlink:href": uri,
                width,
                height
              });

            $region.select(".region_bg")
              .style({
                fill: `url(#${id})`
              });
          });
      });
  }
}
