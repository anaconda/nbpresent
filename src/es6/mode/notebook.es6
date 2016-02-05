import Jupyter from "base/js/namespace";

import {d3, $} from "nbpresent-deps";

import {NotebookPresenter} from "../presenter/notebook";
import {Sorter} from "../sorter";
import {PART} from "../parts";
import {NbpresentTour} from "../tour";
import {Tree} from "../tree";

import {BaseMode} from "./base";

export class NotebookMode extends BaseMode {
  init() {
    super.init();
    this.initStylesheet();
    this.initActions();

    [this.slides, this.theme].map((cursor)=>{
      cursor.on("update", () => {
        console.info("saving metadata");
        this.metadata(true)
      })
    });

    this.tour = new NbpresentTour(this);

  }

  initActions(){
    var _actions = {
      "show-sorter": {
        icon: 'fa-gift',
        help: 'show the slide sorter',
        handler: (env)=> this.show()
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
        href: `${this.root}/nbpresent.min.css`
      });
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

  show(){
    if(!this.sorter){
      this.sorter = new Sorter(this.tree, this.tour, this);
      this.sorter.show();
    }else{
      this.sorter.destroy();
      this.sorter = null;
    }
  }

  present(){
    if(!this.presenter){
      this.presenter = new NotebookPresenter(this.tree, this.tour);
    }
    this.presenter.presenting.set(true);
  }

  unpresent(){
    this.presenter.presenting.set(false);
  }
}
