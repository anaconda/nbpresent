import {d3, uuid} from "nbpresent-deps";

import {ICON} from "../icons";


export class PaletteBuilder {
  constructor(tree, theme){
    this.tree = tree;
    this.theme = theme;

    this.themer = this.tree.select(["app", "themer"]);

    this.palette = this.theme.select(["palette"]);
    this.palette.on("update", ()=>this.update());
  }

  destroy(){
    this.$ui.remove();
  }

  init(panel){
    this.$ui = panel;

    this.$ui.append("h2").text("Color");

    this.$confirm = this.$ui.append("button")
      .classed({"btn btn-default": 1})
      .on("click", () => {
        let id = uuid.v4();
        this.palette.set([id], {id, rgb: [255, 255, 255]});
      })
      .call((btn) => {
        btn.append("i").classed({"fa fa-eyedropper fa-2x": 1});
        btn.append("label").text("+ Color");
      });

    this.$chips = this.$ui.append("div")
      .classed({"palette-chips": 1});

    this.update();
  }

  update(){
    let chip = this.$chips.selectAll(".palette-chip")
      .data(d3.entries(this.palette.get() || {}), ({key}) => key);

    chip.enter().append("div")
      .classed({"palette-chip": 1})
      .call((chip)=>{
        chip.append("input")
          .classed({"palette-chip-example": 1})
          .attr({type: "color"})
          .on("change", ({key}) => {
            let {r,g,b} = d3.rgb(d3.event.target.value);
            this.palette.set([key, "rgb"], [r, g, b]);
          });
        chip.append("div")
          .classed({"palette-chip-details": 1})
          .call((details)=>{
            details.append("button")
              .classed({"btn btn-default pull-right": 1})
              .call((btn) => {
                btn.append("i")
                  .classed(`fa fa-${ICON.trash}`, 1);
              })
              .on("click", ({key}) => {
                this.palette.unset([key]);
              });
          });
      });

    chip.exit().remove();

    chip.select(".palette-chip-example").property({
      "value": ({value}) => {
        return d3.rgb.apply(null, value.rgb).toString();
      }
    });
  }
}
