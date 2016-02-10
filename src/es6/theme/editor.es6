import {d3, uuid, Baobab, WebFont} from "nbpresent-deps";
import _ from "underscore";

import Jupyter from "base/js/namespace";

import {FONTS, SYMB, PANGRAMS} from "./fonts";

import {BackgroundPicker} from "./background";
import {PaletteBuilder} from "./palette";

import {Toolbar} from "../toolbar";

import {loadFonts} from "./fonts";

// pick a random pangram for this session. gotta catch'm all.
const pangram = d3.shuffle(PANGRAMS)[0];


/** Handle the management of themes
*/
export class ThemeEditor {
  constructor(tree, theme){
    this.tree = tree;

    this.theme = theme;
    this.rules = this.theme.select(["rules"]);
    this.textBase = this.theme.select(["text-base"]);
    this.palette = this.theme.select(["palette"]);

    this.themer = tree.select(["themer"]);
    this.focusContent = this.themer.select(["focusContent"]);
    this.exampleText = this.themer.select("exampleText");

    this.focusContent.exists() || this.focusContent.set(true);

    this.backgroundUI = new BackgroundPicker(this.tree, this.theme);
    this.paletteUI = new PaletteBuilder(this.tree, this.theme);

    [this.theme, this.themer]
      .map(({on})=> on("update", () => this.update()));

    this.$body = d3.select("body");

    loadFonts(FONTS);

    this.fontZoom = d3.behavior.zoom()
      .on("zoom", this._zoomCycle("font-family", FONTS));

    this.sizeZoom = d3.behavior.zoom()
      .on("zoom", this._zoomCycle("font-size", d3.range(2, 30, 0.25)));


    this.init();
  }

  selectorUsed(selector){
    return d3.select(`#notebook .cell ${selector}`)[0][0];
  }

  init(){
    let text = this.exampleText.get();

    this.$body.classed({"nbp-theming": 1});

    this.$ui = this.$body
      .append("div")
      .classed({
        "nbp-theme-editor": 1,
        "container-fluid": 1
      })
      .each(function(){ Jupyter.keyboard_manager.register_events(this); });

    let row = this.$ui.append("div")
      .classed({row: 1});

    this.$background = row.append("div")
      .classed({
        "nbp-theme-editor-backgrounds col-md-2 col-xs-6": 1,
      })
      .call((background) => this.backgroundUI.init(background));

    this.$palette = row.append("div")
      .classed({
        "nbp-theme-editor-palette col-md-2 col-xs-6": 1
      })
      .call((palette) => this.paletteUI.init(palette));

    this.$rules = row.append("div")
      .classed({"theme-rules col-md-8 col-xs-12": 1});

    this.$rules.append("h2")
      .text("Type");

    this.$tools = this.$rules.append("div")
      .classed({"nbp-theme-editor-tools": 1});

    this.$ruleWrap = this.$rules.append("div")
      .classed({"theme-rule-wrap": 1});

    this.$tools.append("div").classed({row: 1})
      .call((row)=>{
        this.$baseText = row.append("div")
          .classed({"theme-base-font col-xs-6": 1})
          .datum({key: null, value: null})
          .call((font) => this.fontMenu(font));

          this.toolbar = new Toolbar();

          this.$toolbar = row.append("div")
            .classed({"nbp-theme-editor-toolbar": 1})
            .datum([
              [{
                icon: "compress",
                click: () => this.focusContent.set(!this.focusContent.get()),
                label: "Focus"
              }]
            ])
            .call(this.toolbar.update);
      });

    this.$tools.append("div").classed({row: 1})
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
      .call(this.sizeZoom)
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
          .call(overlay.fontZoom);

        dropdown.append("ul")
          .classed({"dropdown-menu": 1});
      })

  }

  fontZoomed({key, value}){
    let attr = "font-family",
      len = FONTS.length,
      val = !key ? this.textBase.get([attr]) || "Lato" :
        this.rules.get([key, attr]),
      scaled = parseInt(20 * ((d3.event.scale && Math.log(d3.event.scale)) || 0)),
      newVal = FONTS[Math.abs(scaled % len)];

    if(val === newVal){
      return;
    }

    if(!key){
      this.textBase.set([attr], nextFont);
    }else{
      this.rules.set([key, attr], nextFont);
    }
  }

  sizeZoomed({key, value}){
    let attr = "font-size",
      val = !key ? this.textBase.get([attr]) || "Lato" :
        this.rules.get([key, attr]);

    if(val === newVal){
      return;
    }

    if(!key){
      this.textBase.set([attr], nextFont);
    }else{
      this.rules.set([key, attr], nextFont)
    }
  }

  /** factory for d3.behavior.zoom
  */
  _zoomCycle(attr, choices, scale=20){
    const len = choices.length;

    return ({key, value}) => {
      let cursor = key ? this.rules : this.textBase,
        path = key ? [key, attr] : [attr],
        val = cursor.get(path),
        scaled = parseInt(
          scale * ((d3.event.scale && Math.log(d3.event.scale)) || 0)),
        newVal = choices[Math.abs(scaled % len)];

      return val === newVal ? null : cursor.set(path, newVal);
    }
  }


  /** Draw all of the rules
  */
  update(){
    let overlay = this,
      rules = this.rules.get() || {},
      palette = this.palette.get() || {},

      textBase = this.textBase.get() || {},
      baseColor = textBase.color && palette[textBase.color],
      baseBg = baseColor && `rgb(${baseColor.rgb})`,

      exampleText = this.exampleText.get() || "",
      focusContent = this.focusContent.get(),

      rule = this.$ruleWrap.selectAll(".theme-rule")
        .data(SYMB.map((key) => {
          return {key, value: rules[key], base: textBase};
        }), ({key}) => key);

    this.$baseText
      .datum({key: null, value: textBase})
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

    rule.sort((a, b) => {
      return a.key.localeCompare(b.key);
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

      text = text || pangram;

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
      .on("mouseover", ({key, font})=> {
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
    this.$body.classed({"nbp-theming": 0});
    this.backgroundUI.destroy();
    this.$ui.remove();
  }
}
