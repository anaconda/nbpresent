import {d3, uuid, Baobab, WebFont} from "nbpresent-deps";
import _ from "underscore";

import Jupyter from "base/js/namespace";

import {FONTS, SYMB, PANGRAMS} from "./fonts";

import {BackgroundPicker} from "./background";
import {PaletteBuilder} from "./palette";


export class ThemeOverlay{
  constructor(tree, manager){
    this.manager = manager;

    this.tree = tree;

    this.theme = tree.select(["theme"]);
    this.rules = this.theme.select(["rules"]);
    this.textBase = this.theme.select(["text-base"]);

    this.themer = tree.select(".").root().select(["themer"]);
    this.focusContent = this.themer.select(["focuseContent"]);
    this.exampleText = this.themer.select("exampleText");

    this.background = new BackgroundPicker(tree);
    this.palette = new PaletteBuilder(tree);

    [
      this.rules,
      this.textBase,
      this.focusContent,
      this.exampleText,
      this.palette.palette
    ]
      .map(({on})=> on("update", (e)=> this.update(e)));

    WebFont.load({
      google: {
        families: FONTS
      }
    });

    this.init();
  }

  selectorUsed(selector){
    return d3.select(`#notebook .cell ${selector}`)[0][0];
  }

  init(){
    let text = this.exampleText.get();

    this.$ui = d3.select("body")
      .append("div")
      .classed({
        "nbpresent-theme-overlay": 1,
        "container-fluid": 1
      })
      .each(function(){ Jupyter.keyboard_manager.register_events(this); });

    let row = this.$ui.append("div")
      .classed({row: 1});


    this.$background = row.append("div")
      .classed({
        "nbpresent-theme-overlay-backgrounds col-md-2": 1,
      })
      .call((background) => this.background.init(background));

    this.$palette = row.append("div")
      .classed({
        "nbpresent-theme-overlay-palette col-md-2": 1
      })
      .call((palette) => this.palette.init(palette));

    this.$rules = row.append("div")
      .classed({"theme-rules col-md-8": 1});

    this.$toolbar = this.$ui.append("div")
      .classed({
        "nbpresent-theme-overlay-toolbar": 1,
        "row": 1
      });

    this.$focusContent = this.$toolbar.append("div")
      .classed({
        "focus-content": 1,
        "col-md-1": 1
      })
      .call((focus)=>{
        focus.append("input")
          .attr({type: "checkbox"})
          .on("change", ()=>{
            this.focusContent.set(d3.event.target.checked);
          });
        focus.append("label")
          .append("i")
          .classed({"fa fa-compress fa-2x": 1});
      });

    this.$example = this.$toolbar.append("div")
      .classed({"col-md-8": 1})
      .append("input")
      .classed({"theme-example-text": 1, "form-control": 1})
      .property({value: text})
      .attr("placeholder", "Custom Example Text")
      .on("input", () => {
        this.exampleText.set(this.$example.property("value"));
      });

    this.$baseText = this.$toolbar.append("div")
      .classed({"theme-base-font": 1, "col-md-3": 1})
      .datum({key: null, value: null})
      .call((font) => this.fontMenu(font));

    this.update();
  }

  getExemplar(here, tag){
    let parent = d3.select(here.parentNode),
      found = null;

    while(true){
      found = parent.select(tag);
      if(found[0][0]){
        return found;
      }
      found = null;
      parent = d3.select(parent.node().parentNode);
    }
  }

  fontMenu(font){
    let overlay = this;

    let fontGroup = font.append("div").classed({row: 1});


    fontGroup.append("div").classed({"col-md-4": 1})
      .append("input")
      .classed({
        "selector-font-size form-control": 1
      })
      .attr({
        type: "number"
      })
      .on("input", function({key, value}){
        var val = parseFloat(this.value);
        val = !isNaN(val) ? val : null;
        if(key){
          if(val){
            overlay.rules.set([key, "font-size"], parseFloat(this.value));
          }else{
            overlay.rules.unset([key, "font-size"]);
          }
        }else{
          if(val){
            overlay.textBase.set(["font-size"], parseFloat(this.value));
          }else{
            overlay.textBase.unset(["font-size"]);
          }
        }
      });

    fontGroup.append("div").classed({
        "selector-font-name dropdown col-md-7": 1
      })
      .call(function(dropdown){
        dropdown.append("a")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({"data-toggle": "dropdown"})
        dropdown.append("ul")
          .classed({"dropdown-menu": 1});
      });

    fontGroup.append("div")
      .classed({
        "selector-color dropdown col-md-1": 1
      })
      .call(function(dropdown){
        dropdown.append("a")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({"data-toggle": "dropdown"})
        dropdown.append("ul")
          .classed({"dropdown-menu": 1});
      });
  }

  /** Draw all of the rules
  */
  update(){
    this.$baseText
      .datum({value: this.textBase.get()})
      .select(".selector-font-name")
      .call((dropdown) => this.updateFontMenu(dropdown))
      .select(".btn")
      .text(this.textBase.get(["font-family"]));

    this.$baseText.select(".selector-font-color")
      .call((dropdown) => this.updateColorMenu(dropdown));

    this.$baseText.select(".selector-font-size")
      .property({
        value: ({value={}}) => value["font-size"],
      });

    let rules = this.rules.get() || {},
      rule = this.$rules.selectAll(".theme-rule")
        .data(SYMB.map((key)=> {
          return {key, value: rules[key]};
        })),
        overlay = this;

    rule.enter().append("div")
      .classed({"theme-rule": 1})
      .call((rule)=>{
        let settingsRow = rule.append("div")
          .classed({row: 1});

        settingsRow.append("div")
          .classed({
            "selector-label col-md-1": 2
          })
          .append("span");

        settingsRow.append("div")
          .classed({"col-md-5": 1})
          .call((font) => this.fontMenu(font));

        rule.append("div")
          .classed({
            "selector-exemplar": 1
          });

      });

    if(this.focusContent.get()){
      rule.filter(({key}) => !this.selectorUsed(key)).remove();
    }

    rule.select(".selector-label span")
      .text(({key}) => key);

    rule.select(".selector-exemplar").each(function(d){
      let exemplar = d3.select(this),
        text = overlay.exampleText.get();

      if(!text && overlay.focusContent.get()){
        let exEl = overlay.selectorUsed(d.key);
        if(exEl){
          text = d3.select(exEl).text();
        }
      }

      text = text ||   _.sample(PANGRAMS)

      exemplar.selectAll(":not(" + d.key + ")").remove();

      let el = exemplar.selectAll(d.key)
        .data([d]);

      el.enter()
        .append(d.key)
        .attr({"contentEditable": "true"});

      el.text(text)
        .style({
          "font-family": ({value={}}) => {
            return value["font-family"] || overlay.textBase.get(["font-family"]);
          },
          "font-size": ({value={}}) => {
            let txt = value["font-size"] || overlay.textBase.get(["font-size"]);
            txt = txt ? `${txt}rem` : null;
            return txt;
          },
          "color": ({value={}}) => {
            return value.color ? `rgb(${value.color})` : null;
          }
        });

      el.exit().remove();
    });

    rule.select(".selector-font-name")
      .call((dropdown) => this.updateFontMenu(dropdown))
      .select(".btn")
      .text(function({key}){
        return overlay.getExemplar(this, key).style("font-family");
      });

    rule.select(".selector-font-size")
      .attr({
        placeholder: function({key}){
          return overlay.getExemplar(this, key).style("font-size");
        }
      })
      .property({
        value: ({value={}}) => value["font-size"],
      });

    rule.select(".selector-color")
      .call((dropdown) => this.updateColorMenu(dropdown))
      .style({
        "background-color": function({key}){
          return overlay.getExemplar(this, key).style("color");
        }
      });

  }

  updateColorMenu(dropdown){
    let li = dropdown.select(".dropdown-menu")
      .selectAll("li")
      .data(({key, value})=> {
        return d3.entries(this.palette.palette.get() || {})
          .map((color) => {
            return {key, value, color: color.value};
          })
      })

    li.enter()
      .append("li")
      .append("a")
      .text(" ")
      .on("click", ({key, color}) => {
        if(key){
          this.rules.set([key, "color"], color.rgb);
        }else{
          this.textBase.set(["color"], color.rgb);
        }
      });

    li.select("a").style({"background-color": ({color}) => {
      return `rgb(${color.rgb})`;
    }});
  }

  updateFontMenu(dropdown){
    let li = dropdown.select(".dropdown-menu")
      .selectAll("li")
      .data(({key, value}) => {
        return FONTS.map((font) => {
          return {font, key, value};
        });
      });

    li.enter()
      .append("li")
      .append("a")
      .on("click", ({key, font})=> {
        if(key){
          this.rules.set([key, "font-family"], font);
        }else{
          this.textBase.set(["font-family"], font);
        }
      });

    li.select("a")
      .style({"font-family": ({font})=> font})
      .text(({font}) => font);
  }

  destroy(){
    this.background.destroy();
    this.$ui.remove();
  }
}
