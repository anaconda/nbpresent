import {d3} from "nbpresent-deps";

import {Toolbar} from "../toolbar";

export class SpeakerBase {
  constructor(tree){
    this.tree = tree;
    this.current = this.tree.select(["app", "selectedSlide"]);

    this.presenting = this.tree.select(["app", "presenting"]);
    this.presenting.on("update", () => this.update());

    this
      .init()
      .initUI()
      .update();
  }

  init(){
    return this;
  }

  initUI(){
    this.$ui = d3.select("body")
      .append("div")
      .classed({nbpresent_speaker: 1})
      .on("mouseover", ()=> this.focused = true )
      .on("mouseout", ()=> {
        this.focused = false;
        this.startDecay();
      });

    this.initToolbar();
    this.startDecay();
    return this;
  }

  update(){
    this.$ui.style({display: this.presenting.get() ? null : "none"});
  }

  decay(){
    this.energy = (this.energy || 0) * 0.8;
    this.$ui.style({
      opacity: this.focused ? 1 : this.energy
    });

    if(this.focused){
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }else if(this.energy <= 0.1){
      clearInterval(this.decayInterval);
      this.decayInterval = null;
      this.energy = 0;
    }
  }

  startDecay(){
    this.energy = 0.6;
    if(!(this.decayInerval)){
      this.decayInerval = setInterval(()=>this.decay(), 100)
    }
  }

  hint(){
    this.startDecay();
  }

  toolbarIcons(){
    let that = this;

    return [
      [{
        icon: "fast-backward",
        click: () => that.current.set(this.tree.get(["sortedSlides", 0, "key"])),
        label: "First"
      }],
      [{
        icon: "step-backward",
        click: () => this.retreat(),
        label: "Previous"
      }],
      [{
        icon: "step-forward",
        click: () => this.advance(),
        label: "Next"
      }]
    ];
  }

  retreat(){
    let current = this.tree.get(["slides", this.current.get()]);
    this.current.set(current.prev);
  }

  advance(){
    let slides = this.tree.get(["slides"]),
      current = slides[this.current.get()];

    d3.entries(slides).map((d)=> {
      if(d.value.prev === current.id){
        this.current.set(d.key);
      }
    });

    return this.current.get();
  }

  initToolbar(){
    let toolbar = new Toolbar();

    toolbar
      .btnGroupClass("btn-group-vertical")
      .btnClass("btn-link btn-lg")
      .tipOptions({container: "body", placement: "top"});

    // TODO: Make this overlay (Jupyter-branded Reveal Compass)
    this.$toolbar = this.$ui.append("div")
      .classed({"nbp-presenter-toolbar": 1})
      .datum(this.toolbarIcons())
      .call(toolbar.update);

    return this;
  }
}
