import {d3} from "nbpresent-deps";

import {loadFonts} from "./fonts";

export class ThemeCard{
  // accepts a d3 selector bound to {key, value} of themes
  update(theme){
    theme.classed({"nbp-theme-card": 1});

    theme.each(function(){
      let el = d3.select(this);
      ["palette", "backgrounds", "fonts"].map((bit) => {
        if(!el.select(`.nbp-theme-card-${bit}`).node()){
          el.append("div")
            .attr("class", `nbp-theme-card-${bit}`);
        }
      });
    });

    this.updateBackground(theme)
      .updateColor(theme)
      .updateFont(theme);
  }

  updateBackground(theme){
    let background = theme.select(".nbp-theme-card-backgrounds")
      .selectAll(".nbp-theme-card-background")
      .data((theme) => {
        let backgrounds = d3.entries(theme.value.backgrounds || {});

        return backgrounds.map(({value}) => {
          return {
            theme: theme.value,
            background: value,
            height: 100 / backgrounds.length
          };
        });
      });

    background.enter().append("div")
      .classed({"nbp-theme-card-background": 1});

    background.exit().remove();

    background.style({
      height: ({height}) => `${height}%`,
      "background-color": ({theme, background}) => {
        let color = background["background-color"];
        color = color && theme.palette[color];
        if(color){
          return `rgb(${color.rgb})`;
        }
      },
      "background-image": ({background}) => {
        let bg = background["background-image"];
        if(bg){
          return `url(${bg})`;
        }
      }
    });

    return this;
  }

  updateColor(theme){
    let color = theme.select(".nbp-theme-card-palette")
      .selectAll(".nbp-theme-card-color")
      .data(({value}) => d3.entries(value.palette));

    color.enter().append("div")
      .classed({"nbp-theme-card-color": 1});

    color.exit().remove();

    color.style({
      "background-color": ({value}) => {
        return `rgba(${value.rgb || [0,0,0]}, ${value.a || 1})`;
      }
    });

    return this;
  }

  updateFont(theme){
    let rule = theme.select(".nbp-theme-card-fonts")
      .selectAll(".nbp-theme-card-font")
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
