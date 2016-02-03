import {d3, WebFont} from "nbpresent-deps";
import _ from "underscore";

const PRESENT_PREFIX = ".nbpresent_presenting .nbpresent_present";

export class ThemeBase{
  constructor(tree, manager, slide, style){
    this.tree = tree;
    this.rules = this.tree.select(["theme", "rules"]);
    this.manager = manager;
    this.slide = slide;
    this.$style = style;
  }

  init(){
  }

  update(region, part){
    let rules = d3.entries(this.rules.get())
      .map(({key, value})=>{
        let directives = d3.entries(value).map(({key, value})=>{

          if(key === "font-family"){
            WebFont.load({google: {families: [value] }});
          }

          value = _.isNumber(value) ? `${value}rem` : `"${value}"`;

          return `\t${key}: ${value};`;
        });

        return `${PRESENT_PREFIX} ${key}{
          line-height: 1;
          ${directives.join("\n")}
        }`;
      })
      .join("\n");

    this.$style.text(`/* generted */
      ${rules}
    `);
  }


}
