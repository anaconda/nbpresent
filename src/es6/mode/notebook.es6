import _ from "underscore";

import Jupyter from "base/js/namespace";

import {d3, $} from "nbpresent-deps";

import {PART} from "../parts";
import {Tree} from "../tree";

import {Toolbar} from "../toolbar";
import {NotebookPresenter} from "../presenter/notebook";

import {Sorter} from "../sorter";
import {ThemeManager} from "../theme/manager";

import {NbpresentTour} from "../tour";

import {BaseMode} from "./base";


const THEMER = "themer",
  SORTER = "sorter",
  MODES = [
    THEMER,
    SORTER
  ];

export class NotebookMode extends BaseMode {
  init() {
    super.init()
      .initActions();

    this.enabled = this.tree.select(["app", "enabled"]);
    this.enabled.on("update", () => this.enabledChanged());

    this.mode = this.tree.select(["app", "mode"]);
    this.mode.on("update", () => this.modeUpdated());

    let debouncedSave = _.debounce(()=>{
      console.info("saving metadata");
      this.metadata(true);
    }, 1e3);

    [this.slides, this.themes].map((cursor)=>{
      cursor.on("update", debouncedSave);
    });

    this.$body = d3.select("body");

    return this.initUI();
  }


  initUI(){
    this.$ui = this.$body.append("div")
      .classed({"nbp-app": 1});

    this.appBar = new Toolbar()
      .btnClass("btn-default btn-lg")
      .btnGroupClass("btn-group-vertical")
      .tipOptions({container: "body", placement: "top"});

    this.$appBar = this.$ui.append("div")
      .classed({"nbp-app-bar": 1})
      .datum([
        [{
          icon: "youtube-play fa-2x",
          label: "Present",
          click: () => this.present(),
          tip: "Present"
        }],
        [{
          icon: "film fa-2x",
          label: "Slides",
          click: () => this.mode.set(this.mode.get() === SORTER ? null : SORTER)
        }],
        [{
          icon: "paint-brush fa-2x",
          label: "Themes",
          click: () => this.mode.set(this.mode.get() === THEMER ? null : THEMER)
        }],
        [{
          icon: "gift fa-2x",
          label: "About",
          click: () => console.debug("open a window")
        },{
          icon: "question-circle fa-2x",
          label: "Help",
          click: () => this.ensureTour().restart()
        }]
      ])
      .call(this.appBar.update);

    return this;
  }

  initActions(){
    var _actions = {
      "show-sorter": {
        icon: 'fa-gift',
        help: 'enable nbpresent',
        handler: (env) => this.show()
      },
      "show-presentation": {
        icon: 'fa-youtube-play',
        help: 'show presentation',
        handler: (env)=> this.present()
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

    return this;
  }

  metadata(update){
    let md = Jupyter.notebook.metadata;
    if(update){
      md.nbpresent = {
        slides: this.slides.serialize(),
        themes: this.themes.serialize(),
      };
    }else{
      return md.nbpresent || {
        slides: {},
        themes: {}
      }
    }
  }

  ensureTour(){
    if(!this.tour){
      this.tour = new NbpresentTour(this);
    }
    return this.tour;
  }

  enabledChanged(){
    const enabled = this.enabled.get();

    if(enabled){
      this.ensurePresenter();
    }

    this.$body.classed({"nbp-app-enabled": enabled});
  }

  modeClass(mode){
    return {
      themer: ThemeManager,
      sorter: Sorter
    }[mode];
  }

  modeUpdated(){
    const current = this.mode.get();

    MODES.filter((mode) => (mode !== current) && this[mode])
      .map((mode) => {
        this[mode].destroy();
        delete this[mode];
      });

    if(current && this[current]){
      return;
    }

    let ModeClass = this.modeClass(current);

    current && (this[current] = new ModeClass(this.tree));
  }

  show(){
    this.enabled.set(!this.enabled.get());
    return this;
  }


  ensurePresenter(){
    if(!this.presenter){
      this.presenter = new NotebookPresenter(this.tree);
    }
    return this;
  }

  present(){
    this.ensurePresenter();

    const presenting = this.presenter.presenting.get();

    this.presenter.presenting.set(!presenting);

    return this;
  }
}
