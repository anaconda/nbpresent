import {d3, uuid, _} from "nbpresent-deps";

import {ICON} from "../icons";
import {Toolbar} from "../toolbar";

import {ThemeEditor} from "./editor";
import {ThemeCard} from "./card";

import {PLAIN_THEMES} from "./theme/plain";


// TODO: make this configurable
const BASE_THEMES = PLAIN_THEMES;

export class ThemeManager {
  constructor(tree){
    this.tree = tree;

    this.themes = tree.select(["themes", "theme"]);
    this.defaultTheme = tree.select(["themes", "default"]);

    let mgrCursor = tree.select(["app", "theme-manager"]);

    this.current = mgrCursor.select(["current"]);

    this.card = new ThemeCard();

    [this.defaultTheme, this.themes]
      .map(({on}) => on("update", ()=> this.update()));
    this.current.on("update", () => [this.update(), this.currentUpdated()]);

    this.initUI();

    _.defer(() => this.$body.classed({"nbp-theming": 1}));
  }

  destroy(){
    this.$body.classed({"nbp-theming": 0});
    if(this.editor){
      this.editor.destroy();
      delete this.editor;
    }

    _.delay(() => {
      // whatever
      this.$body.selectAll(".nbp-theme-editor").remove();
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
          icon: "plus-square-o",
          click: () => this.addTheme(),
          label: "+ Theme"
        },{
          icon: ICON.trash,
          visible: () => this.current.get(),
          click: () => this.destroyTheme(this.current.get()),
          label: "- Theme"
        }]
      ]);

    return this.update()
      .currentUpdated();
  }

  update(){
    let themes = this.themes.get() || {},
      current = this.current.get(),
      theme = this.$ui.selectAll(".nbp-theme-preview")
        .data(d3.entries(themes), ({key}) => key),
      canned = this.$ui.selectAll(".nbp-theme-preview-canned")
        .data(d3.entries(BASE_THEMES), ({key}) => key),
      defaultTheme = this.defaultTheme.get();

    this.$toolbar.call(this.toolbar.update);

    theme.enter().append("div")
      .classed({"nbp-theme-preview": 1})
      .call((theme) => {
        theme.append("a")
          .classed({"nbp-default-theme btn": 1})
          .on("click", ({key}) => this.defaultTheme.set(key))
          .append("i")
          .classed({"fa": 1});

        theme.append("div")
          .classed({"nbp-theme-preview-card": 1})
          .on("click", ({key}) => this.current.set(key));
      });

    theme.exit().remove();

    theme.classed({
      "nbp-theme-preview-current": ({key}) => key === current
    });

    theme.select(".nbp-default-theme i")
      .classed({
        "fa-star-o": ({key}) => key !== defaultTheme,
        "fa-star": ({key}) => key === defaultTheme
      });

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

    this.editor && this.editor.destroy();

    if(current){
      if(!defaultTheme || !themes[defaultTheme]){
        this.defaultTheme.set(current);
      }
      this.editor = new ThemeEditor(
        this.tree,
        this.themes.select([current])
      );
    }
  }

  addTheme(){
    let id = uuid.v4();

    this.themes.set([id], {
      id
    });

    this.current.set(id);
  }

  destroyTheme(theme){
    theme = theme || this.current.get();
    if(theme){
      this.themes.unset([theme]);
    }
    this.current.set(null);
  }
}
