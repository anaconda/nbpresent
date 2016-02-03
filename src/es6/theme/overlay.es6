import {d3, uuid, Baobab, WebFont} from "nbpresent-deps";
import _ from "underscore";

import Jupyter from "base/js/namespace";

import {FONTS} from "./fonts";

export const SYMB = `h1 h2 h3 h4 h5 h6 h7
    ul ol li
    code blockquote pre
    strong em a
    table thead tbody tfoot th td`
  .split(/\s+/);

// http://clagnut.com/blog/2380/#Perfect_pangrams_in_English_.2826_letters.29
export const PANGRAMS = [
  "A zenith of Xvurj’s cwm KL Gybdq",
  "Zombies play crwth, quj FDG xvnk",
  "Blowzy night-frumps vex’d Jack Q.",
  "Dwarf mobs quiz lynx.jpg, kvetch!",
  "Frowzy things plumb vex’d Jack Q.",
  "G.B. fjords vex quick waltz nymph.",
  "Glum Schwartzkopf vex’d by NJ IQ.",
  "Gym DJ Beck vows phiz tranq flux.",
  "Jerk gawps foxy Qum Blvd. chintz.",
  "JFK got my VHS, PC and XLR web quiz.",
  "Jocks find quartz glyph, vex BMW.",
  "J.Q. Vandz struck my big fox whelp.",
  "J.Q. Schwartz flung D.V. Pike my box.",
  "Jump dogs, why vex Fritz Blank QC?",
  "Mr. Jock, TV quiz PhD, bags few lynx.",
  "New job: fix Mr. Gluck’s hazy TV, PDQ!",
  "Quartz glyph job vex’d cwm finks.",
  "Quartz jock vends BMW glyph fix.",
  "The glib czar junks my VW Fox PDQ."
];

export class ThemeOverlay{
  constructor(tree, manager){
    this.tree = tree;
    this.manager = manager;
    this.theme = tree.select(["theme"]);
    this.themer = tree.select(".").root().select(["themer"]);
    this.exampleText = this.themer.select("exampleText");

    this.theme.on("update", (e)=> this.update(e));
    this.themer.on("update", (e)=> this.update(e));

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


    this.$toolbar = this.$ui.append("div")
      .classed({
        "nbpresent-theme-overlay-toolbar": 1,
        "row": 1
      });

    this.$example = this.$toolbar.append("input")
      .classed({"theme-example-text": 1, "input": 1, "col-xs-3": 1})
      .property({value: text})
      .attr("placeholder", "Custom Example Text")
      .on("input", () => {
        this.themer.set(["exampleText"], this.$example.property("value"));
      });


    this.$focusContent = this.$toolbar.append("div")
      .classed({
        "focus-content": 1,
        "col-xs-2": 1
      })
      .call((focus)=>{
        focus.append("input")
          .attr({type: "checkbox"})
          .on("change", ()=>{
            this.themer.set(["focusContent"], d3.event.target.checked);
          });
        focus.append("label")
          .text("Content Focus");
      });

    this.$rules = this.$ui.append("div")
      .classed({"theme-rules": 1});

    this.update();
  }

  /** Draw all of the rules
  */
  update(){
    let rules = this.theme.get(),
      rule = this.$rules.selectAll(".theme-rule")
      .data(SYMB.map((key)=> {
        return {key, value: rules[key]};
      }, ({key}) => key)),
      overlay = this;

    console.table(rules, rule.data());

    rule.enter().append("div")
      .classed({"theme-rule": 1, row: 1})
      .call((rule)=>{
        rule.append("div")
          .classed({
            "col-xs-1": 1,
            "selector-label": 1
          })
          .append("span");

        rule.append("div")
          .classed({
            "selector-exemplar": 1,
            "col-xs-8": 1
          });

        let $fontGroup = rule.append("div")
          .classed({"col-xs-1": 1})
          .append("div")
          .classed({"input-group": 1});

        $fontGroup.append("div")
          .classed({
            "selector-font-name": 1,
            "input-group-btn": 1
          })
          .call(function(dropdown){
            dropdown.append("button")
              .classed({"btn btn-default dropdown-toggle": 1})
              .attr({"data-toggle": "dropdown"})
              .append("i")
              .classed({"fa fa-font fa-2x": 1});
            dropdown.append("ul")
              .classed({"dropdown-menu": 1});
          });

        $fontGroup.append("input")
          .classed({
            "selector-font-size": 1,
            "form-control": 1
          })
          .attr({
            type: "number"
          })
          .on("input", function({key, value}){
            var val = parseFloat(this.value);
            val = !isNaN(val) ? val : null;
            if(val){
              overlay.theme.set([key, "font-size"], parseFloat(this.value));
            }else{
              overlay.theme.unset([key, "font-size"]);
            }
          });
      });

    if(this.themer.get(["focusContent"])){
      rule.filter(({key}) => !this.selectorUsed(key)).remove();
    }

    rule.select(".selector-label span")
      .text(({key}) => key);

    rule.select(".selector-exemplar").each(function(d){
      let exemplar = d3.select(this),
        text = overlay.exampleText.get();

      if(!text && overlay.themer.get(["focusContent"])){
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
        .append(d.key);

      el.attr({"contentEditable": "true"})
        .text(text)
        .style({
          "font-family": ({value={}}) => value["font-family"],
          "font-size": ({value={}}) => value["font-size"] + "px"
        });

      el.exit().remove();
    });

    rule.select(".selector-font-name")
      .call((dropdown) => this.updateFont(dropdown));

    rule.select(".selector-font-size")
      .property({
        value: ({value={}}) => value["font-size"]
      });

  }

  updateFont(dropdown){
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
        console.log(key, font, this.theme.get());
        this.theme.set([key, "font-family"], font);
      });

    li.select("a")
      .style({"font-family": ({font})=> font})
      .text(({font}) => font);
  }

  destroy(){
    this.$ui.remove();
  }
}
