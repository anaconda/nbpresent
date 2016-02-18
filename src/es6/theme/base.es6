import {d3} from "nbpresent-deps";

import {loadFonts} from "./fonts";

const PRESENT_PREFIX = ".nbp-presenting .nbp-present";

export class ThemeBase{
  constructor(theme, slide, style){
    this.theme = theme;
    this.rules = theme.select(["rules"]);
    this.palette = theme.select(["palette"]);

    this.backgrounds = theme.select(["backgrounds"]);
    this.textBase = theme.select(["text-base"]);
    this.slide = slide;
    this.$style = style;
  }

  update(region, part){ // eslint-disable-line no-unused-vars
    // TODO: allow per-region (heh, and per-slide) theme customization
  }

  init(){
    let palette = this.palette.get() || {};

    let rules = [{
      key: "",
      value: this.textBase.get() || {}
    }].concat(d3.entries(this.rules.get() || {}))
      .map(({key, value})=>{
        let directives = d3.entries(value).map(({key, value})=>{
          switch(key){
            case "font-size":
              value = `${value}rem`;
              break;
            case "font-family":
              loadFonts([value]);
              value = `"${value}"`;
              break;
            case "color":
              let {rgb=[0, 0, 0], a=1.0} = palette[value] || {};
              value = `rgba(${rgb}, ${a})`;
              break;
          }

          return `\t${key}: ${value};`;
        });

        const BLOCKS = d3.range(1, 7).map((i) => `h${i}`)
          .concat(["blockquote"]);

        if(BLOCKS.indexOf(key) !== -1){
          directives.push('margin: 0 0 1.3em 0;')
          directives.push('padding: 0;');
        }

        return `${PRESENT_PREFIX} ${key}{
          line-height: 1.25;
          ${directives.join("\n")}
        }`;
      })
      .join("\n");

    this.$style.text(rules);

    let backgrounds = this.backgrounds.get() || {},
      background = d3.select(".nbp-presenter-backgrounds")
        .selectAll(".nbp-presenter-background")
        .data(d3.entries(backgrounds, ({key}) => key));

    background.exit().remove();

    background.enter().append("div").classed({
      "nbp-presenter-background": 1
    });

    background.style({
      "background-image": ({value}) => {
        let img = value["background-image"];
        return img && `url(${img})`;
      },
      "background-color": ({value}) => {
        let {rgb} = palette[value["background-color"]] || {};
        return rgb && `rgb(${rgb})`
      },
      "background-position": ({value}) => `${value.x} ${value.y}`,
      left: 0,
      right: 0,
      bottom: 0,
      top: 0
    });
  }


}
