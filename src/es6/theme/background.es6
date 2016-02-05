import {d3, Vibrant, uuid} from "nbpresent-deps";

import {JPY_BRAND, UI_BG} from "../less";

export const THUMBNAIL_MIN_DIM = 48;

export const BG_POS_H = ["left", "center", "right"],
  BG_POS_V = ["top", "middle", "bottom"],
  BG_POSITIONS = d3.merge(
    BG_POS_H.map((x) => BG_POS_V.map((y)=> { return {x, y}; }))
  ),
  HANDLE_RADIUS = 10;

export class BackgroundPicker {
  constructor(tree){
    this.tree = tree;

    this.themer = this.tree.select(["themer"]);

    this.newBackground = this.themer.select(["newBackground"]);
    this.newBackground.on("update", () => this.updateNewBackground());

    this.paletteCache = this.themer.select(["paletteCache"]);
    this.paletteCache.on("update", () => this.updatePaletteCache());
    this.paletteCache.on("update", () => this.updateBackgrounds());

    this.backgrounds = this.tree.select(["theme", "backgrounds"]);
    this.backgrounds.on("update", () => this.updateBackgrounds());

    this.palette = this.tree.select(["theme", "palette"]);

    this.boxScale = {
      x: d3.scale.ordinal()
        .domain(BG_POS_H)
        .range([0, 80, 160]),
      y: d3.scale.ordinal()
        .domain(BG_POS_V)
        .range([0, 45, 90])
    }
  }

  destroy(){
    this.$ui.remove();
  }

  init(panel){
    this.$ui = panel;

    this.$makeNew = this.$ui.append("div");

    this.$backgrounds = this.$ui.append("div")
      .classed({
        "theme-background-thumbnails": 1
      })
      .append("div");

    this.$makeNew.append("div")
      .classed({dropdown: 1})
      .call((dropdown)=>{
        dropdown.append("button")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({type: "button", "data-toggle": "dropdown"})
          .text("Background");

        this.$dropdown = dropdown.append("ul")
          .classed({"dropdown-menu nbpresent-background-picker": 1});
      });

    this.$grid = this.$makeNew.append("div");

    this.$grid.append("svg")
      .call((svg)=>this.initHandles(svg));

    this.$attach = this.$makeNew.append("div");

    this.$attach.append("button")
      .classed({"btn btn-default": 1})
      .append("i")
      .classed({"fa fa-thumbs-up fa-2x": 1})
      .on("click", ()=>{
        if(!this.backgrounds.get()){
          this.backgrounds.set([this.newBackground.get()]);
        }else{
          this.backgrounds.push(this.newBackground.get());
        }
        this.newBackground.set({});
      });

    this.$scratch = this.$makeNew.append("canvas")
      .classed({"theme-scratch": 1});

    this.updateBackgrounds();
    this.updateNewBackground();
  }

  updatePaletteCache(){
    d3.entries(this.paletteCache.get() || {})
      .map(({key, value})=>{
        if(value === -1){
          this.paletteCache.set([key], 0);
          let v = new Vibrant(key);
          v.getPalette((err, patches)=>{
            this.paletteCache.set([key], JSON.parse(JSON.stringify(patches)));
          });
        }
      });
  }

  updateBackgrounds(){
    let picker = this,
      background = this.$backgrounds.selectAll(".theme-background-thumbnail")
        .data(this.backgrounds.get() || []);

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
          .on("click", (d) => {
            this.backgrounds.splice(
              [this.backgrounds.get().indexOf(d), 1]
            )
          });
      });

    background.each(function(d, i){
      picker.drawHandles(d3.select(this), picker.backgrounds.select(i));

      picker.paletteCache.exists([d.src]) ||
        picker.paletteCache.set([d.src], -1);
    });

    background.select("img")
      .attr({
        src: ({src}) => src
      });

    let swatch = background.select(".theme-background-palette")
      .selectAll(".background-palette-swatch")
      .data((d)=>{
        let palette = this.paletteCache.get(d.src);
        if(palette && palette != -1){
          return d3.entries(palette).map(({key, value}) => {
            return value;
          });
        }
        return [];
      });

    swatch.enter().append("div")
      .classed({"background-palette-swatch": 1})
      .on("click", ({rgb}) => {
        let id = uuid.v4();
        this.palette.set([id], {
          id,
          rgb
        });
      });

    swatch.style({
      "background-color": ({rgb})=> {
        return `rgb(${rgb})`
      }
    });

    background.exit().remove();
  }

  updateNewBackground(){
    let picker = this,
      li = this.$dropdown.selectAll("li")
        .data(d3.merge(this.findImages()).map((el)=> picker.dataUri(el)));

    li.enter().append("li")
      .append("a")
      .on("click", function(uri){
        picker.newBackground.set(["src"], uri);
      });

    li.exit().remove();

    li.select("a").style({
      "background-image": (uri) => `url(${uri})`
    });

    this.$grid
      .style({display: () => {
        return this.newBackground.get(["src"]) ? "block" : "none"
      }})
      .call((container) => this.drawHandles(container, this.newBackground));

    this.$attach.style({
      display: this.newBackground.get("x") ? "block" : "none"
    });
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

    let act = cursor.get();

    handle.select("circle").attr({
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
