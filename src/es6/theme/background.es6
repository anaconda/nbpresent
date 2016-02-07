import {d3, Vibrant, uuid} from "nbpresent-deps";

import {JPY_BRAND, UI_BG} from "../less";

export const THUMBNAIL_MIN_DIM = 48;

export const BG_POS_H = ["left", "right"],
  BG_POS_V = ["top", "bottom"],
  BG_POSITIONS = d3.merge(
    BG_POS_H.map((x) => BG_POS_V.map((y)=> { return {x, y}; }))
  ),
  HANDLE_RADIUS = 10,
  PCACHE_REQUEST = -1,
  PCACHE_STARTED = 0;

export class BackgroundPicker {
  constructor(tree, theme){
    this.tree = tree;

    this.theme = theme;

    this.themer = this.tree.select(["app", "themer"]);

    this.newBackground = this.themer.select(["newBackground"]);
    this.newBackground.on("update", () => this.updateNewBackground());

    this.paletteCache = this.themer.select(["paletteCache"]);
    this.paletteCache.on("update", () => this.updatePaletteCache());
    this.paletteCache.on("update", () => this.updateBackgrounds());

    this.backgrounds = this.theme.select(["backgrounds"]);
    this.backgrounds.on("update", () => this.updateBackgrounds());

    this.palette = this.theme.select(["palette"]);

    try{
      this.serializer = new window.XMLSerializer();
    }catch(err){
      console.info("Might have some issues serializing SVG");
    }

    this.boxScale = {
      x: d3.scale.ordinal()
        .domain(BG_POS_H)
        .range([0, 160]),
      y: d3.scale.ordinal()
        .domain(BG_POS_V)
        .range([0, 90])
    }
  }

  destroy(){
    this.$ui.remove();
  }

  init(panel){
    this.$ui = panel;

    this.$makeNew = this.$ui.append("div");

    this.$backgrounds = this.$ui.append("div")
      .classed({"theme-background-thumbnails": 1})
      .append("div");

    this.$makeNew.append("div")
      .classed({dropdown: 1})
      .call((dropdown)=>{
        dropdown.append("button")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({type: "button", "data-toggle": "dropdown"})
          .text("Backgrounds...");

        this.$dropdown = dropdown.append("ul")
          .classed({"dropdown-menu nbp-background-picker": 1});
      });

    this.$grid = this.$makeNew.append("div");

    this.$grid.append("svg")
      .call((svg)=>this.initHandles(svg));


    this.$scratch = this.$makeNew.append("canvas")
      .classed({"theme-scratch": 1});

    this.updateBackgrounds();
    this.updateNewBackground();
  }

  updatePaletteCache(){
    d3.entries(this.paletteCache.get() || {})
      .map(({key, value})=>{
        if(value === PCACHE_REQUEST){
          this.paletteCache.set([key], PCACHE_STARTED);

          Vibrant.from(key)
            .getPalette((err, patches) => {
              if(err){
                return console.error("palette error", {key, value}, err);
              }
              patches = JSON.parse(JSON.stringify(patches));

              patches = d3.entries(patches)
                .reduce((memo, {key, value})=>{
                  if(value){
                    memo[key] = value;
                  }
                  return memo;
                }, {});

              this.paletteCache.set([key], patches);
            });
        }
      });
  }

  updateBackgrounds(){
    let picker = this,
      backgrounds = this.backgrounds.get() || {},
      background = this.$backgrounds.selectAll(".theme-background-thumbnail")
        .data(d3.entries(backgrounds, ({key}) => key));

    background.enter().append("div")
      .classed({"theme-background-thumbnail row": 1})
      .call((thumb)=>{
        thumb.append("img");

        thumb.append("svg")
          .call((svg) => this.initHandles(svg))
          .append("g").classed({handles: 1});

        thumb.append("div")
          .classed({"theme-background-palette": 1});

        thumb.append("button")
          .classed({"btn btn-default pull-right": 1})
          .call((btn)=>{
            btn.append("i")
              .classed({"fa fa-trash": 1});
          })
      });

    background.each(function({key, value}){
      picker.drawHandles(d3.select(this), picker.backgrounds.select([key]));
      picker.paletteCache.exists([value.src]) ||
        picker.paletteCache.set([value.src], PCACHE_REQUEST);
    });

    background.select("button")
      .on("click", ({key}) => {
        this.backgrounds.unset([key]);
      });

    background.select("img")
      .attr({src: ({value}) => value.src});

    let swatch = background.select(".theme-background-palette")
      .selectAll(".background-palette-swatch")
      .data(({key, value})=>{
        let palette = this.paletteCache.get([value.src]);
        if(palette && palette != PCACHE_REQUEST){
          return d3.entries(palette);
        }
        return [];
      });

    swatch.exit().remove();

    swatch.enter().append("div")
      .classed({"background-palette-swatch": 1})
      .on("click", ({key, value}) => {
        let id = uuid.v4();
        this.palette.set([id], {
          id,
          rgb: value.rgb
        });
      });

    swatch.style({"background-color": ({value})=> `rgb(${value.rgb})`});

    background.exit().remove();

    return this;
  }

  updateNewBackground(){
    let picker = this,
      li = this.$dropdown.selectAll("li")
        .data(d3.merge(this.findImages()).map((el)=> picker.dataUri(el)));

    li.enter().append("li")
      .append("a")
      .on("click", (uri) => {
        let id = uuid.v4();
        this.backgrounds.set([id], {
          id,
          src: uri,
          x: BG_POS_H[0],
          y: BG_POS_H[1],
        });
      });

    li.exit().remove();

    li.select("a").style({
      "background-image": (uri) => {
        return `url(${uri})`
      }
    });

    this.$grid
      .style({display: () => {
        return this.newBackground.get(["src"]) ? "block" : "none"
      }})
      .call((container) => this.drawHandles(container, this.newBackground));

    return this;
  }

  initHandles(svg){
    svg.attr({
        width: this.boxScale.x("right") + 2,
        height: this.boxScale.y("bottom") + 2
      })
      .append("g").classed({root: 1})
      .attr({transform: "translate(1 1)"})
      .call((grid)=>{
        grid.append("rect").classed({bg: 1})
          .attr({
            width: this.boxScale.x("right"),
            height: this.boxScale.y("bottom")
          });
        grid.append("g").classed({handles: 1});
      });
  }

  drawHandles(container, cursor){
    let handle = container.select(".handles")
      .selectAll(".handle")
      .data(BG_POSITIONS);

    handle.enter().append("g").classed({"handle": 1})
      .append("circle")
      .on("click", ({x, y}) => cursor.merge({x, y}));

    let act = cursor.get() || {};

    handle.select("circle")
      .attr({
        cx: ({x}) => this.boxScale.x(x),
        cy: ({y}) => this.boxScale.y(y),
        r: HANDLE_RADIUS
      })
      .transition()
      .style({
        fill: ({x, y}) => {
          let fill = ((x === act.x) && (y === act.y) && JPY_BRAND) || UI_BG;
          return fill;
        }
      });
  }

  dataUri(el){
    let uri;

    switch(el.tagName.toLowerCase()){
      case 'svg':
        uri = `data:image/svg+xml;base64,${btoa(this.serialize(el))}`;
        break;
      case 'canvas':
        uri = el.toDataURL();
        break;
      case 'img':
        if(el.src.indexOf("data:") === 0){
          uri = el.src;
          break;
        }
        let ctx = this.$scratch.node().getContext('2d');
        ctx.canvas.width = window.clientWidth;
        ctx.canvas.height = window.clientHeight;
        ctx.drawImage(el, 0, 0);
        uri = this.$scratch.node().toDataURL();
        break;
      default:
        console.debug("Data URI for ", el.tagName, "not implemented.");
        break;
    }

    return uri;
  }

  serialize(node) {
    return this.serializer ? this.serializer.serializeToString(node) :
      node.xml ? node.xml :
      "";
  }

  findImages(){
    // find good candidate thumbnails
    return d3.selectAll('.cell')
      .selectAll('img, canvas, svg')
      .filter(function(){
        return this.clientWidth > THUMBNAIL_MIN_DIM &&
          this.clientHeight > THUMBNAIL_MIN_DIM;
      });
  }
}
