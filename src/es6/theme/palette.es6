import {d3} from "nbpresent-deps";

export class PaletteBuilder {
  constructor(tree){
    this.tree = tree;
    this.theme = this.tree.select(["theme"]);
    this.themer = this.tree.select(["themer"]);

    this.palette = this.theme.select(["palette"]);
    this.palette.on("update", ()=>this.update());
  }

  destroy(){
    this.$ui.remove();
  }

  init(panel){
    this.$ui = panel;

    this.$chips = this.$ui.append("div")
      .classed({"palette-chips": 1});

    this.update();
  }

  update(){
    let chip = this.$chips.selectAll(".palette-chip")
      .data(d3.entries(this.palette.get() || {}));

    chip.enter().append("div")
      .classed({"palette-chip": 1})
      .call((chip)=>{
        chip.append("div")
          .classed({"palette-chip-example": 1});
        chip.append("div")
          .classed({"palette-chip-details": 1});
      });

    chip.select(".palette-chip-example").style({
      "background-color": ({value}) => `rgb(${value.rgb})`
    });

    chip.exit().remove();
  }
}
