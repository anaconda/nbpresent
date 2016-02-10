import {d3, Vibrant, uuid} from "nbpresent-deps";

import {JPY_BRAND, UI_BG} from "../less";
import {SLIDE_WIDTH, SLIDE_HEIGHT} from "../mini";

export const THUMBNAIL_MIN_DIM = 48;

export const BG_POS_H = ["left", "center", "right"],
  BG_POS_V = ["top", "center", "bottom"],
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
        .range([0, SLIDE_WIDTH / 2, SLIDE_WIDTH]),
      y: d3.scale.ordinal()
        .domain(BG_POS_V)
        .range([0, SLIDE_HEIGHT / 2, SLIDE_HEIGHT])
    }
  }

  destroy(){
    this.$ui.remove();
  }

  init(panel){
    this.$ui = panel;

    this.$ui.append("h2").text("Background");

    this.$makeNew = this.$ui.append("div")
      .classed({"nbp-theme-background-new": 1});

    this.$backgrounds = this.$ui.append("div")
      .classed({"theme-background-thumbnails": 1})
      .append("div");

    this.$makeNew.append("div")
      .classed({"dropdown nbp-background-new-image": 1})
      .call((dropdown)=>{
        dropdown.append("button")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({type: "button", "data-toggle": "dropdown"})
          .call((btn) => {
            btn.append("i").classed({"fa fa-image fa-2x": 1});
            btn.append("label").text("Image");
          });

        this.$imageDropdown = dropdown.append("ul")
          .classed({"dropdown-menu nbp-background-picker-image": 1});
      });


    this.$makeNew.append("div")
      .classed({"dropdown nbp-background-new-color": 1})
      .call((dropdown)=>{
        dropdown.append("button")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({type: "button", "data-toggle": "dropdown"})
          .call((btn) => {
            btn.append("i").classed({"fa fa-square fa-2x": 1});
            btn.append("label").text("Color");
          });

        this.$colorDropdown = dropdown.append("ul")
          .classed({"dropdown-menu nbp-background-picker-color": 1});
      });

    this.$grid = this.$makeNew.append("div");

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
        .data(d3.entries(backgrounds, ({key}) => key)),
      palette = this.palette.get();

    background.enter().append("div")
      .classed({"theme-background-thumbnail row": 1})
      .call((thumb)=>{
        thumb.append("div")
          .classed({"theme-background-thumbnail-preview": 1})
          .append("svg")
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

      let img = value["background-image"];

      if(img && !picker.paletteCache.exists([img])){
        picker.paletteCache.set([img], PCACHE_REQUEST);
      }
    });

    background.select("button")
      .on("click", ({key}) => {
        this.backgrounds.unset([key]);
      });

    background.select(".theme-background-thumbnail-preview")
      .classed({
        "nbp-theme-has-image": ({value}) => value["background-image"],
        "nbp-theme-has-color": ({value}) => value["background-color"]
      })
      .style({
        "background-image": ({value}) => {
          let img = value["background-image"];
          return img ? `url(${img})` : null;
        },
        "background-color": ({value}) => {
          let {rgb} = palette[value["background-color"]] || {};
          return rgb ? `rgb(${rgb})` : null;
        }
      });

    let swatch = background.select(".theme-background-palette")
      .selectAll(".background-palette-swatch")
      .data(({key, value}) => {
        let bg = value["background-image"];
        if(!bg){
          return [];
        }
        let palette = this.paletteCache.get([bg]);

        if(palette && palette !== PCACHE_REQUEST){
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
      img = this.$imageDropdown.selectAll("li")
        .data(d3.merge(this.findImages()).map((el)=> picker.dataUri(el))),
      palette = this.palette.get();

    img.enter().append("li")
      .append("a")
      .on("click", (uri) => {
        let id = uuid.v4();
        this.backgrounds.set([id], {
          id,
          "background-image": uri,
          x: BG_POS_H[1],
          y: BG_POS_H[1],
        });
      });

    img.exit().remove();

    img.select("a").style({
      "background-image": (uri) => {
        return `url(${uri})`
      }
    });

    let color = this.$colorDropdown.selectAll("li")
      .data(d3.entries(palette));

    color.enter().append("li")
      .append("a")
      .on("click", ({key, value}) => {
        let id = uuid.v4();
        this.backgrounds.set([id], {
          id,
          "background-color": key
        });
      });

    color.exit().remove();

    color.select("a").style({
      "background-color": ({key}) => `rgb(${palette[key].rgb})`
    });

    this.$grid
      .call((container) => this.drawHandles(container, this.newBackground));

    return this;
  }

  initHandles(svg){
    svg.attr({
        width: this.boxScale.x("right"),
        height: this.boxScale.y("bottom")
      })
      .append("g").classed({root: 1})
      .attr({transform: "translate(1 1)"})
      .call((grid)=>{
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
