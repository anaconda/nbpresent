import {d3} from "nbpresent-deps";

import {loadFonts} from "./fonts";

export class ThemeCard{
  // accepts a d3 selector bound to {key, value} of themes
  update(theme){
    if(!theme.select(".nbp-theme-card-palette").node()){
      theme.append("div")
        .classed({"nbp-theme-card-palette": 1});
    }

    this.updateColor(theme)
      .updateFont(theme);
  }

  updateColor(theme){
    theme.classed({"nbp-theme-card": 1});

    let color = theme.select(".nbp-theme-card-palette")
      .selectAll(".nbp-theme-card-color")
      .data(({value}) => d3.entries(value.palette))

    color.enter().append("div")
      .classed({"nbp-theme-card-color": 1});

    color.exit().remove();

    color.style({
      "background-color": ({value}) => {
        return `rgba(${value.rgb || [0,0,0]}, ${value.a || 1})`
      }
    });

    return this;
  }

  updateFont(theme){
    let rule = theme.selectAll(".nbp-theme-card-font")
      .data(({value}) => {
        let rules = d3.entries(value.rules),
          base = value["text-base"];
        if(base){
          rules = rules.concat([{key: "∅", value: base}]);
        }
        return rules.filter(({value}) => {
          return value["font-family"] || value["font-size"] || value["font-color"];
        });
      });

    rule.enter().append("div")
      .classed({"nbp-theme-card-font": 1});

    rule.exit().remove();

    rule.text(({key, value}) => `${key} ${value["font-size"] || ""}`)
      .style({
        "font-family": ({value}) => {
          let font = value["font-family"];
          font && loadFonts([font]);
          return font;
        },
        "color": (({value}) => value["color"])
      });

    return this;
  }
}
