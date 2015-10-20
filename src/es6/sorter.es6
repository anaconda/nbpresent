import d3 from "d3";
import uuid from "node-uuid";

class Sorter {
  constructor(tree) {
    this.tree = tree;
    // TODO: put this in the tree
    this.visible = this.tree.select("visible");
    this.visible.set(false);

    this.$view = d3.select("body")
      .append("div")
      .classed({
        nbpresent_sorter: 1,
        offscreen: 1
      });

    this.initToolbar();
    this.initDrag();

    this.$slides = this.$view.append("div")
      .classed({slides_wrap: 1});

    this.slides = this.tree.select(["slides"]);
    this.slides.on("update", ()=> this.draw(this.slides.get()));
  }

  initDrag(){
    let that = this;

    this.drag = d3.behavior.drag()
      .on("dragstart", function(d){
        d3.select(this)
          .style({
            position: "fixed",
          });

      })
      .on("drag", function(d){
        let {clientX, clientY} = d3.event.sourceEvent;
        d3.select(this)
          .style({
            left: `${clientX}px`,
            top: `${clientY}px`,
          });
      })
      .on("dragend", function(d){
        d3.select(this)
          .style({
            position: null,
            left: null
          });
        let tgt = d3.event.sourceEvent.target,
          td = d3.select(tgt).datum();

        that.moveSlide(d.key, td.key);
      });
  }

  draw(slides){
    slides = d3.entries(slides);

    console.table(slides.map((d)=> d.value));

    let $slide = this.$slides.selectAll(".slide")
      .data(slides, (d) => d.key)
      .sort((a, b) => a.value.prev === null || a.value.next == b.key ? -1 : 1);

    $slide.enter().append("div")
      .classed({slide: 1})
      .call(this.initSlide, this);
  }

  initSlide(slide, that){
    slide
      .text((d) => d.key)
      .call(that.drag);
  }

  initToolbar(){
    this.$toolbar = this.$view.append("div")
      .classed({
        sorter_toolbar: 1,
        "btn-toolbar": 1
      });

    let $slide_actions = this.$toolbar.append("div")
      .classed({"btn-group": 1});

    $slide_actions.selectAll(".btn")
      .data([{
          icon: "plus-square-o",
          on: {click: () => this.appendSlide()}
      }])
      .enter()
      .append("a")
      .classed({btn: 1, "btn-default": 1, "btn-lg": 1})
      .call(function($btn){
        let icon = $btn.append("i")
          .classed({fa: 1})
          .each(function(d){
            d3.select(this).classed(`fa-${d.icon}`, 1);
          });
      })
      .each(function(d){
        let $btn = d3.select(this);
        Object.keys(d.on).map((key)=>{
          $btn.on(key, d.on[key]);
        });
      });
  }

  nextId(){
    return uuid.v4();
  }

  removeSlide(id){
    let {prev, next} = this.slides.get(id);
    prev && this.slides.set([prev, "next"], next);
    next && this.slides.set([next, "prev"], prev);
    this.slides.set([id, "next"], null);
    this.slides.set([id, "prev"], null);
  }

  moveSlide(id, after=null, before=null){
    console.log("move", id, after, before);
    this.removeSlide(id);

    let prev, next;

    if(after){
      prev = after;
      next = this.slides.get(after).next;
      this.slides.set([after, "next"], id);
      next && this.slides.set([next, "prev"], id);
    }else if(before){
      prev = before;
      next = this.slides.get(before).prev;
      prev && this.slides.set([prev, "next"], id);
      this.slides.set([before, "prev"], id);
    }

    this.slides.set([id, "prev"], prev);
    this.slides.set([id, "next"], next);
  }

  appendSlide(after=null){
    let slides = d3.entries(this.slides.get())

    let prev = slides.filter((d) => d.value.next === after);

    prev = prev.length ? prev[0] : null;

    let id = this.nextId();
    this.slides.set(id, {id,
      prev: prev ? prev.key : null,
      next: prev ? prev.value.next : null
    });

    prev && this.slides.set([prev.key, "next"], id);
    prev && prev.value.next && this.slides.set([prev.value.next, "prev"], id);
  }

  show(){
    this.visible.set(!this.visible.get());
    this.update();
  }

  update(){
    this.$view.classed({offscreen: !this.visible.get()});
    let $slide = this.$slides.selectAll(".slide_thumb")
      .data(this.tree.get("slides"), d => d.id);

    $slide.enter()
      .append("div")
      .classed({slide_thumb: 1});
  }
}

export {Sorter};
