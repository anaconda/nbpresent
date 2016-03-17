import {d3, uuid, _} from "nbpresent-deps";

import {ICON} from "../icons";
import {Toolbar} from "../toolbar";

import {ThemeCard} from "./card";

import {PLAIN_THEMES} from "./theme/plain";
import {REVEAL_THEMES} from "./theme/reveal";


// TODO: make this configurable
const BASE_THEMES = _.extend({},
  PLAIN_THEMES,
  REVEAL_THEMES
);

export class ThemeManager {
  constructor(tree){
    this.tree = tree;

    this.themes = tree.select(["themes", "theme"]);
    this.defaultTheme = tree.select(["themes", "default"]);

    let mgrCursor = tree.select(["app", "theme-manager"]);
    this.stockThemes = mgrCursor.select(["themes"]);
    this.current = mgrCursor.select(["current"]);

    this.card = new ThemeCard();

    [this.defaultTheme, this.themes, this.stockThemes]
      .map(({on}) => on("update", ()=> this.update()));
    this.current.on("update", () => [
      this.currentUpdated(),
      _.defer(()=> this.update())
    ]);

    this.initUI();

    _.defer(() => this.$body.classed({"nbp-theming": 1}));
  }

  destroy(){
    this.$body.classed({"nbp-theming": 0});

    _.delay(() => {
      this.$ui.remove();
    }, 200);
  }

  initUI(){
    this.$body = d3.select("body");
    this.$ui = this.$body.append("div")
      .classed({"nbp-theme-manager": 1});

    this.toolbar = new Toolbar()
      .btnGroupClass("btn-group-vertical");

    this.$toolbar = this.$ui.append("div")
      .datum([
        [{
          icon: ICON.trash,
          visible: () => this.current.get(),
          click: () => this.destroyTheme(this.current.get()),
          label: "- Theme"
        }]
      ]);

    this.$ui.append("div")
      .classed({"nbp-theme-previews": 1})
      .append("h2").text("Your Themes");

    this.$ui.append("div")
      .classed({"nbp-theme-previews-canned": 1})
      .append("h2").text("Community Themes");

    return this.update()
      .currentUpdated();
  }

  update(){
    let themes = this.themes.get() || {},
      current = this.current.get(),
      stock = _.extend({}, this.stockThemes.get(), BASE_THEMES),
      theme = this.$ui.select(".nbp-theme-previews")
        .selectAll(".nbp-theme-preview")
        .data(d3.entries(themes), ({key}) => key),
      canned = this.$ui.select(".nbp-theme-previews-canned")
        .selectAll(".nbp-theme-preview-canned")
        .data(d3.entries(stock), ({key}) => key),
      defaultTheme = this.defaultTheme.get();

    this.$toolbar.call(this.toolbar.update);

    theme.enter().append("div")
      .classed({"nbp-theme-preview": 1})
      .call((theme) => {
        theme.append("div")
          .classed({"nbp-theme-preview-card": 1})
          .on("click", ({key}) => this.current.set(key));

        theme.append("a")
          .classed({"nbp-default-theme btn": 1})
          .on("click", ({key}) => this.defaultTheme.set(key))
          .append("i")
          .classed({"fa fa-2x": 1});
      });

    theme.exit().remove();

    theme.classed({
      "nbp-theme-preview-current": ({key}) => key === current
    });

    let _cls = [];

    _cls[`fa-${ICON.defaultTheme}`] = ({key}) => key !== defaultTheme
    _cls[`fa-${ICON.defaultThemeActive}`] = ({key}) => key === defaultTheme;

    theme.select(".nbp-default-theme i")
      .classed(_cls);

    this.card.update(theme.select(".nbp-theme-preview-card"));

    canned.enter().append("div")
      .classed({"nbp-theme-preview-canned": 1})
      .on("click", ({value}) => {
        let id = uuid.v4();
        this.themes.set([id], _.extend({}, value, {id}));
        this.current.set(id);
      });

    canned.exit().remove();

    this.card.update(canned);

    return this;
  }

  currentUpdated(){
    let current = this.current.get(),
      defaultTheme = this.defaultTheme.get(),
      themes = this.themes.get();

    if(current){
      if(!defaultTheme || !themes[defaultTheme]){
        this.defaultTheme.set(current);
      }
    }
  }

  destroyTheme(theme){
    theme = theme || this.current.get();
    if(theme){
      this.themes.unset([theme]);
    }
    this.current.set(null);
  }
}
