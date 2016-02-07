import {d3} from "nbpresent-deps";

export class ThemeCard{
  // accepts a d3 selector bound to {key, value} of themes
  update(theme){
    theme.classed({"nbp-theme-card": 1});

    console.log(theme.data());

    let color = theme.selectAll(".nbp-theme-card-color")
      .data(({value}) => d3.entries(value.palette))

    color.enter().append("div")
      .classed({"nbp-theme-card-color": 1});

    color.exit().remove();

    color.style({
      "background-color": ({value}) => {
        return `rgba(${value.rgb || [0,0,0]}, ${value.a || 1})`
      }
    });
  }
}
