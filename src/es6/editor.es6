import {d3} from "nbpresent-deps";

import {PART} from "./parts";

import {RegionTree} from "./regiontree";
import {NotebookCellManager} from "./cells/notebook";

import {bbox} from "./d3.bbox";

const DIRS = ["left", "right", "up", "down"],
  DIR_ATTR = {
    left: "x",
    right: "x",
    up: "y",
    down: "y"
  },
  DIR_DELTA = {
    left: -1,
    right: 1,
    up: -1,
    down: 1
  };

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
    this.destroyed = false;

    /** cursor pointed at a specific slide.
      * @type {baobab.Cursor} */
    this.slide = slide;

    /** the currently selected region
      * @type {object}
      * @param {baobab.Cursor} the region/slide to edit */
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
    [this.selectedRegion, this.slide].map(({on})=> on("update", ()=> {
      this.destroyed || this.update();
    }));
  }

  /** Destroy the editor and its children utterly. */
  destroy() {
    this.sidebar.destroy();
    this.$ui.remove();
    this.deinitActions();

    this.destroyed = true;
  }


  /** Create d3 behaviors.
    * @return {Editor} */
  initBehavior(){
    /** @type {d3.bbox} */
    this.bbox = bbox();
    this.initActions();

    return this;
  }

  /** Create all UI chrome.
    * @return {Editor} */
  initUI(){
    this.$body = d3.select("body");

    /** @type {d3.selection} */
    this.$ui = d3.select("body")
      .append("div")
      .classed({"nbp-editor": 1});

    /** @type {d3.selection} */
    this.$bg = this.$ui.append("div")
      .classed({slide_bg: 1});

    /** @type {d3.selection} */
    this.$svg = this.$bg.append("svg");

    /** @type {d3.selection} */
    this.$defs = this.$svg.append("defs");

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
      {region} = this.selectedRegion.get(),
      scales = {
        x: this.x,
        y: this.y,
        width: this.x,
        height: this.y
      };

    if(!region){
      return;
    }

    this.slide.merge(["regions", region, "attrs"],
      d3.entries(scales)
        .reduce((memo, {key, value}) => {
          memo[key] = value.invert($el.attr(key));
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
      width = uibb.width - ((2 * this.padding())),
      height = width / this.aspectRatio(),
      regions = d3.entries(this.regions.get() || {}),
      {slide, region} = this.selectedRegion.get() || {},
      {x, y} = this;

    if(height > uibb.height + 2 * this.padding()){
      height = uibb.height - (2 * this.padding());
      width = height * this.aspectRatio();
    }

    this.x.range([0, width]);
    this.y.range([0, height]);

    this.$bg.style({
      left: `${(((uibb.width) - width) / 2)}px`,
      top: `${(uibb.height - height) / 2}px`,
      width: `${width}px`,
      height: `${height}px`
    });

    this.$svg.attr({width, height});

    regions.sort((a, b) =>
      (region === a.key) ? 1 :
      (region === b.key) ? -1 :
      (a.value.attrs.z || 0) - (b.value.attrs.z || 0));

    let $region = this.$svg.selectAll(".region")
      .data(regions, ({key}) => key)
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
          .classed({"nbp-region-bg": 1})
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
        active: ({key}) => key === region,
        "nbp-content-source": this.hasContent(PART.source),
        "nbp-content-outputs": this.hasContent(PART.outputs),
        "nbp-content-widgets": this.hasContent(PART.widgets),
        "nbp-content-whole": this.hasContent(PART.whole),
        "nbp-content-null": this.hasContent(null)
      })
    .select(".nbp-region-bg")
      .transition()
      .attr({
        width: (d) => x(d.value.attrs.width),
        height: (d) => y(d.value.attrs.height),
        x: (d) => x(d.value.attrs.x),
        y: (d) => y(d.value.attrs.y)
      });

    $region.filter(({value}) => !value.content)
      .select(".nbp-region-bg")
      .style({fill: null});
  }

  cycleRegion(delta=1){
    let {region} = this.selectedRegion.get(),
      regions = d3.entries(this.regions.get()),
      idx = regions.map(({key, value}, i) => key === region ? i : -1)
        .filter((i) => i !== -1)[0];

    idx = idx + delta;
    if(idx === -1){
      idx = regions.length - 1;
    }

    this.selectedRegion.set(["region"], regions[idx % regions.length].key);
  }

  moveRegion(env, direction, amount=0.1){
    console.log(direction, amount);
    let {region} = this.selectedRegion.get(),
      attr = DIR_ATTR[direction],
      delta = DIR_DELTA[direction];

    this.regions.set(
      [region, "attrs", attr],
      this.regions.get([region, "attrs", attr]) + (delta * amount)
    )
    return this;
  }

  initActions(){

    let _actions = {
        "prev-region": {
          icon: "caret-square-o-left",
          help: "select previous region",
          handler: (env) => this.cycleRegion()
        },
        "next-region": {
          icon: "caret-square-o-right",
          help: "select next region",
          handler: (env) => this.cycleRegion(-1)
        }
      },
      _keys = {
        "shift-tab": "nbpresent:prev-region",
        "tab": "nbpresent:next-region"
      };

    DIRS.map((dir) => {
      _actions[`nudge-region-${dir}`] = {
        icon: `arrow-circle-o-${dir}`,
        help: `nudge current region ${dir}`,
        handler: (env) => this.moveRegion(env, dir, 0.01)
      };
      _keys[dir] = `nbpresent:nudge-region-${dir}`;

      _actions[`move-region-${dir}`] = {
        icon: `arrow-circle-o-${dir}`,
        help: `move current region ${dir}`,
        handler: (env) => this.moveRegion(env, dir, 0.1)
      };
      _keys[`shift-${dir}`] = `nbpresent:move-region-${dir}`;
    });


    d3.entries(_actions).map(({key, value}) => {
      Jupyter.notebook.keyboard_manager.actions.register(
        value,
        key,
        "nbpresent"
      );
    });

    Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts(_keys);
  }

  deinitActions(){
    ["shift+tab", "tab"].concat(DIRS)
      .map((shortcut) =>{
        try{
          Jupyter.notebook.keyboard_manager.command_shortcuts.remove_shortcut(
            shortcut
          );
        } catch(err) {

        }
      });
    return this;
  }

}
