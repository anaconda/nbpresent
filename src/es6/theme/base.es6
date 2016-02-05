import {d3, WebFont} from "nbpresent-deps";
import _ from "underscore";

const PRESENT_PREFIX = ".nbpresent_presenting .nbpresent_present";

export class ThemeBase{
  constructor(tree, manager, slide, style){
    this.tree = tree;
    this.rules = this.tree.select(["theme", "rules"]);
    this.palette = this.tree.select(["theme", "palette"]);

    this.backgrounds = this.tree.select(["theme", "backgrounds"]);
    this.textBase = this.tree.select(["theme", "text-base"]);
    this.manager = manager;
    this.slide = slide;
    this.$style = style;

  }

  update(region, part){
    // TODO: allow per-region (heh, and per-slide) theme customization
  }

  init(){
    let palette = this.palette.get();

    let rules = [{
      key: "",
      value: this.textBase.get()
    }].concat(d3.entries(this.rules.get()))
      .map(({key, value})=>{
        let directives = d3.entries(value).map(({key, value})=>{
          switch(key){
            case "font-size":
              value = `${value}rem`;
              break;
            case "font-family":
              WebFont.load({google: {families: [value] }});
              value = `"${value}"`;
              break;
            case "color":
              let {rgb=[0, 0, 0], a=1.0} = palette[value] || {};
              value = `rgba(${rgb}, ${a})`;
              break;
          }

          return `\t${key}: ${value};`;
        });
        return `${PRESENT_PREFIX} ${key}{
          line-height: 1.1;
          ${directives.join("\n")}
        }`;
      })
      .join("\n");

    this.$style.text(rules);

    let backgrounds = this.backgrounds.get() || {},
      background = d3.select(".nbpresent-presenter-backgrounds")
        .selectAll(".nbpresent-presenter-background")
        .data(d3.entries(backgrounds, ({key}) => key));

    background.exit().remove();

    background.enter().append("img").classed({
      "nbpresent-presenter-background": 1
    });


    background.attr({
      src: ({value}) => value.src
    })
    .style({
      left: ({value})=> !["left", "center"].indexOf(value.x) ? 0 : null,
      right: ({value})=> !["right", "center"].indexOf(value.x) ? 0 : null,
      top: ({value})=> value.y === "top" ? 0 : null,
      bottom: ({value})=> value.y === "bottom" ? 0 : null,
    });
  }


}
