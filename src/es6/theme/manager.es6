import {d3, uuid} from "nbpresent-deps";

import {Toolbar} from "../toolbar";

import {ThemeEditor} from "./editor";
import {ThemeCard} from "./card";

export class ThemeManager {
  constructor(tree){
    this.tree = tree;

    this.themes = tree.select(["themes", "theme"]);

    let mgrCursor = tree.select(["app", "theme-manager"]);

    this.current = mgrCursor.select(["current"]);

    this.card = new ThemeCard();

    this.themes.on("update", () => this.update());
    this.current.on("update", () => [this.update(), this.currentUpdated()]);

    this.initUI();
  }

  destroy(){
    if(this.editor){
      this.editor.destroy();
      delete this.editor;
    }
    // whatever
    this.$body.selectAll(".nbp-theme-editor").remove();
    this.$ui.remove();
  }

  initUI(){
    this.$body = d3.select("body");
    this.$ui = this.$body.append("div")
      .classed({"nbp-theme-manager": 1});

    this.toolbar = new Toolbar();

    this.$toolbar = this.$ui.append("div")
      .datum([
        [{
          icon: "plus-square-o",
          click: () => this.addTheme(),
          label: "+ Theme"
        }]
      ]);

    return this.update()
      .currentUpdated();
  }

  update(){
    let themes = this.themes.get() || {},
      current = this.current.get(),
      theme = this.$ui.selectAll(".nbp-theme-preview")
        .data(d3.entries(themes), ({key}) => key);

    this.$toolbar.call(this.toolbar.update);

    theme.enter().append("div")
      .classed({"nbp-theme-preview": 1})
      .on("click", ({key}) => this.current.set(key));

    this.card.update(theme);

    theme.classed({
      "nbp-theme-preview-current": ({key}) => key === current
    });

    return this;
  }

  currentUpdated(){
    let current = this.current.get();

    this.editor && this.editor.destroy();

    if(current){
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
}
