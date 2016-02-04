import {d3, WebFont} from "nbpresent-deps";
import _ from "underscore";

const PRESENT_PREFIX = ".nbpresent_presenting .nbpresent_present";

export class ThemeBase{
  constructor(tree, manager, slide, style){
    this.tree = tree;
    this.rules = this.tree.select(["theme", "rules"]);
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
    let rules = [{
      key: "",
      value: this.textBase.get()
    }].concat(d3.entries(this.rules.get()))
      .map(({key, value})=>{
        let directives = d3.entries(value).map(({key, value})=>{

          if(key === "font-family"){
            WebFont.load({google: {families: [value] }});
          }

          value = _.isNumber(value) ? `${value}rem` : `"${value}"`;

          return `\t${key}: ${value};`;
        });
        return `${PRESENT_PREFIX} ${key}{
          line-height: 1.1;
          ${directives.join("\n")}
        }`;
      })
      .join("\n");

    this.$style.text(`/* ${new Date()} */
      ${rules}
    `);

    let background = d3.select(".nbpresent-presenter-backgrounds")
      .selectAll(".nbpresent-presenter-background")
      .data(this.backgrounds.get());

    background.exit().remove();

    background.enter().append("img").classed({
      "nbpresent-presenter-background": 1
    });


    background.attr({
      src: (d) => d["background-image"]
    })
    .style({
      left: ({x})=> !["left", "center"].indexOf(x) ? 0 : null,
      right: ({x})=> !["right", "center"].indexOf(x) ? 0 : null,
      top: ({y})=> y === "top" ? 0 : null,
      bottom: ({y})=> y === "bottom" ? 0 : null,
    });
  }


}
