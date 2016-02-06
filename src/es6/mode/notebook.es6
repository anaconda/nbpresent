import Jupyter from "base/js/namespace";

import {d3, $} from "nbpresent-deps";

import {PART} from "../parts";
import {Tree} from "../tree";

import {Toolbar} from "../toolbar";
import {NotebookPresenter} from "../presenter/notebook";
import {Sorter} from "../sorter";

import {NbpresentTour} from "../tour";

import {BaseMode} from "./base";

export class NotebookMode extends BaseMode {
  init() {
    super.init()
      .initUI()
      .initStylesheet()
      .initActions();

    this.enabled = this.tree.select(["enabled"]);
    this.enabled.on("update", () => this.enabledChanged());

    [this.slides, this.theme].map((cursor)=>{
      cursor.on("update", () => {
        console.info("saving metadata");
        this.metadata(true);
      })
    });

    this.tour = new NbpresentTour(this);

    this.$body = d3.select("body");
    this.$header = d3.select("#header");

    this.tree.set(["active"], false);
    this.tree.on

    return this;
  }

  initUI(){
    this.appBar = new Toolbar()
      .btnClass("btn-default btn-lg")
      .btnGroupClass("btn-group-vertical")
      .tipOptions({container: "body", placement: "top"});

    this.$appBar = d3.select("body").append("div")
      .classed({"nbpresent-app-bar": 1})
      .datum([
        [{
          icon: "youtube-play fa-2x",
          label: "Present",
          click: () => this.present(),
          tip: "Present"
        }],
        [{
          icon: "th-large fa-2x",
          label: "Slides",
          click: () => this.editSlide(this.selectedSlide.get()),
          tip: "Edit Slide",
          // visible: () => this.selectedSlide.get() && !this.editor
        }],
        [{
          icon: "paint-brush  fa-2x",
          tip: "Theme",
          label: "Theme",
          click: () => this.themeMode()
        }]
      ])
      .call(this.appBar.update);
    return this;
  }

  initActions(){
    var _actions = {
      "show-sorter": {
        icon: 'fa-gift',
        help: 'show the slide sorter',
        handler: (env) => this.show()
      },
      "show-presentation": {
        icon: 'fa-youtube-play',
        help: 'show presentation',
        handler: (env)=> this.presenter && this.presenter.presenting.get() ?
          this.unpresent() :
          this.present()
      }
    };

    d3.entries(_actions).map(({key, value}) => {
      Jupyter.notebook.keyboard_manager.actions.register(
        value,
        key,
        "nbpresent"
      );
    });

    Jupyter.notebook.keyboard_manager.command_shortcuts.add_shortcuts({
      "esc": "nbpresent:show-presentation"
    });
  }

  initStylesheet(){
    let css = d3.select("head")
      .selectAll("link#nbpresent-css")
      .data([1]);

    if(css.node()){
      console.warn("nbpresent extension already loaded!");
      return;
    }

    css.enter()
      .append("link")
      .attr({id: "nbpresent-css"})
      .attr({
        rel: "stylesheet",
        href: `${this.root}/../css/nbpresent.min.css`
      });

    return this;
  }

  metadata(update){
    let md = Jupyter.notebook.metadata;
    if(update){
      md.nbpresent = {
        slides: this.slides.serialize(),
        theme: this.theme.serialize(),
      };
    }else{
      return md.nbpresent || {
        slides: {},
        theme: {}
      }
    }
  }

  enabledChanged(){
    const enabled = this.enabled.get();

    if(!enabled){
      this.sorter && this.sorter.destroy();
      this.sorter = null;
    }else{
      this.ensurePresenter();
      this.$appBar.style({
        "padding-top": `${this.$header.node().clientHeight}px`
      });
      this.sorter = new Sorter(this.tree, this.tour, this);
      this.sorter.show();
    }

    this.$body.classed({"nbpresent-app-enabled": enabled});
  }

  show(){
    this.enabled.set(!this.enabled.get());
    return this;
  }


  ensurePresenter(){
    if(!this.presenter){
      this.presenter = new NotebookPresenter(this.tree, this.tour);
    }
    return this;
  }

  present(){
    this.ensurePresenter();
    this.presenter.presenting.set(true);
    return this;
  }

  unpresent(){
    this.presenter.presenting.set(false);
    return this;
  }
}
