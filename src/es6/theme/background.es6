import {d3, Vibrant} from "nbpresent-deps";

import {JPY_BRAND, UI_BG} from "../less";

export const THUMBNAIL_MIN_DIM = 48;

export const BG_POS_H = ["left", "center", "right"],
  BG_POS_V = ["top", "middle", "bottom"],
  BG_POSITIONS = d3.merge(
    BG_POS_H.map((x) => BG_POS_V.map((y)=> { return {x, y}; }))
  ),
  HANDLE_RADIUS = 10;

export class BackgroundPicker {
  constructor(tree, manager){
    this.tree = tree;
    this.manager = manager;

    this.newBackground = this.tree.select(["themer", "newBackground"]);
    this.newBackground.on("update", (e) => this.update(e));

    this.backgrounds = this.tree.select(["theme", "backgrounds"]);
    this.backgrounds.on("update", (e) => this.update(e));

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

    this.$makeNew = this.$ui.append("div")
      .classed({
        row: 1
      });

    this.$backgrounds = this.$ui.append("div")
      .classed({
        row: 1,
        "theme-background-thumbnails": 1
      })
      .append("div")
      .classed({"col-md-11 col-md-offset-1": 1});

    this.$makeNew.append("div")
      .classed({"col-md-2 col-md-offset-1": 1})
      .append("div")
      .classed({dropdown: 1})
      .call((dropdown)=>{
        dropdown.append("button")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({type: "button", "data-toggle": "dropdown"})
          .text("Background");

        this.$dropdown = dropdown.append("ul")
          .classed({"dropdown-menu nbpresent-background-picker": 1});
      });

    this.$grid = this.$makeNew.append("div")
      .classed({"col-md-3": 1});

    this.$grid.append("svg")
      .call((svg)=>this.initHandles(svg));

    this.$attach = this.$makeNew.append("div")
      .classed({"col-md-3": 1});

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

    this.update();
  }

  update(e){
    let picker = this,
      background = this.$backgrounds.selectAll(".theme-background-thumbnail")
        .data(() => this.backgrounds.get() || []);

    background.enter().append("div")
      .classed({"theme-background-thumbnail pull-left": 1})
      .call((thumb)=>{
        thumb.append("button")
          .classed({"btn btn-default pull-right": 1})
          .call((btn)=>{
            btn.append("i")
              .classed({"fa fa-trash fa-2x": 1});
          })
          .on("click", (d) => {
            this.backgrounds.splice(
              [this.backgrounds.get().indexOf(d), 1]
            )
          });

        thumb.append("svg")
          .call((svg) => this.initHandles(svg))
          .append("g").classed({handles: 1});
      });

    background.each(function(d, i){
      picker.drawHandles(d3.select(this), picker.backgrounds.select(i));
      var v = new Vibrant(d["background-image"]);
      v.getPalette((err, palette)=>{
        console.log(err);
        console.log(palette);
      })
    });

    background.style({
      "background-image": (d)=> `url(${d["background-image"]})`
    });

    background.exit().remove();

    let li = this.$dropdown.selectAll("li")
      .data(d3.merge(this.findImages()).map((el)=> picker.dataUri(el)));

    li.enter().append("li")
      .append("a")
      .on("click", function(uri){
        picker.newBackground.set(["background-image"], uri);
      });

    li.exit().remove();

    li.select("a").style({
      "background-image": (uri) => `url(${uri})`
    });

    this.$grid
      .style({display: () => {
        return this.newBackground.get(["background-image"]) ? "block" : "none"
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
