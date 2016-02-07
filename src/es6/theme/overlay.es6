import {d3, uuid, Baobab, WebFont} from "nbpresent-deps";
import _ from "underscore";

import Jupyter from "base/js/namespace";

import {FONTS, SYMB, PANGRAMS} from "./fonts";

import {BackgroundPicker} from "./background";
import {PaletteBuilder} from "./palette";


export class ThemeOverlay{
  constructor(tree){
    this.tree = tree;

    this.theme = tree.select(["theme"]);
    this.rules = this.theme.select(["rules"]);
    this.textBase = this.theme.select(["text-base"]);
    this.palette = this.theme.select(["palette"]);

    this.themer = tree.select(".").root().select(["themer"]);
    this.focusContent = this.themer.select(["focuseContent"]);
    this.exampleText = this.themer.select("exampleText");

    this.backgroundUI = new BackgroundPicker(tree);
    this.paletteUI = new PaletteBuilder(tree);

    [
      this.rules,
      this.textBase,
      this.focusContent,
      this.exampleText,
      this.palette
    ]
      .map(({on})=> on("update", (e)=> this.update(e)));

    this.$body = d3.select("body");

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

    this.$body.classed({"nbpresent-theming": 1});

    this.$ui = this.$body
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
        "nbpresent-theme-overlay-backgrounds col-md-2 col-xs-6": 1,
      })
      .call((background) => this.backgroundUI.init(background));

    this.$palette = row.append("div")
      .classed({
        "nbpresent-theme-overlay-palette col-md-2 col-xs-6": 1
      })
      .call((palette) => this.paletteUI.init(palette));

    this.$rules = row.append("div")
      .classed({"theme-rules col-md-8 col-xs-12": 1});

    this.$toolbar = this.$rules.append("div")
      .classed({"nbpresent-theme-overlay-toolbar": 1});

    this.$ruleWrap = this.$rules.append("div")
      .classed({"theme-rule-wrap": 1});

    this.$toolbar.append("div").classed({row: 1})
      .call((row)=>{
        this.$baseText = row.append("div")
          .classed({"theme-base-font col-xs-6": 1})
          .datum({key: null, value: null})
          .call((font) => this.fontMenu(font));

        this.$focusContent = row.append("div")
          .classed({
            "focus-content col-xs-2 col-xs-offset-3": 1
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
      });

    this.$toolbar.append("div").classed({row: 1})
      .call((row)=>{
        this.$example = row.append("div")
          .classed({"col-xs-12": 1})
          .append("input")
          .classed({"theme-example-text": 1, "form-control": 1})
          .property({value: text})
          .attr("placeholder", "Custom Example Text")
          .on("input", () => {
            this.exampleText.set(this.$example.property("value"));
          });
      });

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
    let overlay = this,
      row = font.append("div").classed({row: 1});

    row.append("div")
      .classed({"selector-label col-xs-3": 1})
      .text("∅");

    row.append("div")
      .classed({"selector-color dropdown col-xs-1": 1})
      .call(function(dropdown){
        dropdown.append("a")
          .classed({"btn btn-default dropdown-toggle": 1})
          .attr({"data-toggle": "dropdown"})
        dropdown.append("ul")
          .classed({"dropdown-menu": 1});
      });

    row.append("div").classed({"col-xs-4": 1})
      .append("input")
      .classed({"selector-font-size form-control": 1})
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

    row.append("div").classed({
        "selector-font-name dropdown col-xs-4": 1
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
    let overlay = this,
      rules = this.rules.get() || {},
      rule = this.$ruleWrap.selectAll(".theme-rule")
        .data(SYMB.map((key)=> {
          return {key, value: rules[key]};
        }), ({key}) => key),
      palette = this.palette.get() || {},
      exampleText = this.exampleText.get() || "",
      textBase = this.textBase.get() || {},
      baseColor = textBase.color && palette[textBase.color],
      baseBg = baseColor && `rgb(${baseColor.rgb})`,
      focusContent = this.focusContent.get();

    this.$baseText
      .datum({value: textBase})
      .select(".selector-font-name")
      .call((dropdown) => this.updateFontMenu(dropdown))
      .select(".btn")
      .text(textBase["font-family"] || "sans-serif");

    this.$baseText.select(".selector-color")
      .call((dropdown) => this.updateColorMenu(dropdown))
      .style({"background-color": baseBg});

    this.$baseText.select(".selector-font-size")
      .attr({placeholder: "14px"})
      .property({
        value: ({value={}}) => value["font-size"],
      });

    rule.enter().append("div")
      .classed({"theme-rule": 1})
      .call((rule)=>{
        let settingsRow = rule.append("div")
          .classed({row: 1});

        settingsRow.append("div")
          .classed({"col-md-6 col-xs-12": 1})
          .call((font) => this.fontMenu(font));

        rule.append("div")
          .classed({
            "selector-exemplar": 1
          });

      });

    if(focusContent){
      rule.filter(({key}) => !this.selectorUsed(key)).remove();
    }


    rule.select(".selector-exemplar").each(function(d){
      let exemplar = d3.select(this),
        text = exampleText;

      if(!text && focusContent){
        let exEl = overlay.selectorUsed(d.key);
        if(exEl){
          text = d3.select(exEl).text();
        }
      }

      text = text || _.sample(PANGRAMS);

      exemplar.selectAll(":not(" + d.key + ")").remove();

      let el = exemplar.selectAll(d.key)
        .data([d]);

      el.enter()
        .append(d.key)
        .attr({"contentEditable": "true"});

      el.text(text)
        .style({
          "font-family": ({value={}}) => {
            return value["font-family"] || textBase["font-family"];
          },
          "font-size": ({value={}}) => {
            let txt = value["font-size"] || textBase["font-size"];
            txt = txt ? `${txt}rem` : null;
            return txt;
          },
          "color": ({value={}}) => {
            let color = value.color && palette[value.color];
            if(color){
              return `rgba(${color.rgb}, ${color.a || 1.0})`;
            }
            return baseBg;
          }
        });

      el.exit().remove();
    });

    rule.select(".selector-label").text(({key}) => key);

    rule.select(".selector-font-size")
      .attr({
        placeholder: function({key}){
          return key ? overlay.getExemplar(this, key).style("font-size") :
            "14px";
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

    rule.select(".selector-font-name")
      .call((dropdown) => this.updateFontMenu(dropdown))
      .select(".btn")
      .text(function({key}){
        return key ? overlay.getExemplar(this, key).style("font-family") :
          "sans-serif";
      });
  }

  updateColorMenu(dropdown){
    let colors = d3.entries(this.palette.get() || {}),
      li = dropdown.select(".dropdown-menu")
        .selectAll("li")
        .data(({key, value})=> {
          return colors.map((color) => {
            return {key, value, color: color.value};
          });
        });

    li.enter()
      .append("li")
      .append("a")
      .text(" ")
      .on("click", ({key, color}) => {
        if(key){
          this.rules.set([key, "color"], color.id);
        }else{
          this.textBase.set(["color"], color.id);
        }
      });

    li.select("a").style({"background-color": ({color}) => {
      return `rgba(${color.rgb}, ${color.a || 1.0})`;
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
    this.$body.classed({"nbpresent-theming": 0});
    this.backgroundUI.destroy();
    this.$ui.remove();
  }
}
