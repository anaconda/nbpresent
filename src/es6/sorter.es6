import d3 from "d3";
import uuid from "node-uuid";

class Sorter {
  constructor(tree) {
    this.tree = tree;
    // TODO: put this in the tree
    this.visible = this.tree.select("visible");
    this.visible.set(false);

    this.$view = d3.select("#header")
      .append("div")
      .classed({
        nbpresent_sorter: 1,
        offscreen: 1
      });

    this.initToolbar();
    this.initDrag();

    this.$slides = this.$view.append("div")
      .classed({slides_wrap: 1});

    this.$empty = this.$slides.append("h3")
      .classed({empty: 1})
      .text("No slides yet.");

    this.slides = this.tree.select(["slides"]);
    this.slides.on("update", () => this.draw());

    this.draw();
  }

  initDrag(){
    let that = this,
      dragOrigin;


    this.drag = d3.behavior.drag()
      .on("dragstart", function(d){
        let slide = d3.select(this);
        slide
          .classed({dragging: 1});
        dragOrigin = parseFloat(slide.style("top"));
      })
      .on("drag", function(d){
        d3.select(this)
          .style({
            top: `${dragOrigin += d3.event.dy}px`,
          });
      })
      .on("dragend", function(d, i){
        let $slide = d3.select(this)
          .classed({dragging: 0});

        let top = parseFloat($slide.style("top")),
          slides = that.sortedSlides(),
          slideN = Math.floor(top / that.slideHeight()),
          after;

        console.log({slideN, top});

        if(top < that.slideHeight() || slideN < 0){
          after = null;
        }else if(slideN > slides.length || !slides[slideN]){
          after = slides.slice(-1)[0].key;
        }else{
          after = slides[slideN].key;
        }
        console.log("after", after);

        if(d.key !== after){
          that.removeSlide(d.key);
          that.appendSlide(d.key, after);
        }

        that.draw();
      });
  }

  // put in tree?
  sortedSlides(){
    let slides = d3.entries(this.slides.get());

    slides.sort(
      (a, b) => a.value.prev === null || a.value.next == b.key ? -1 : 1
    )

    return slides;
  }

  slideHeight() {
    return 100;
  }

  draw(){
    let that = this;

    let slides = this.sortedSlides();

    console.table(slides.map(({value}) => value));

    let $slide = this.$slides.selectAll(".slide")
      .data(slides, (d) => d.key);

    $slide.enter().append("div")
      .classed({slide: 1})
      .text((d) => d.key)
      .call(this.drag)
      .style({
        left: "200px"
      });

    $slide
      .style({
        "z-index": (d, i) => i
      })
      .transition()
      .delay((d, i) => i * 100)
      .style({
        left: "0px",
        top: (d, i) => `${i * this.slideHeight()}px`
      });

    this.$empty.style({opacity: 1 * !$slide[0].length });
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
        on: {click: () => {
          let last = this.sortedSlides().slice(-1);
          this.appendSlide(null, last.length ? last[0].key : null );
        }}
      }, {
        icon: "youtube-play",
        on: {click: () => this.play()}
      }])
      .enter()
      .append("a")
      .classed({btn: 1, "btn-default": 1, "btn-xs": 1})
      .call(function($btn){
        let icon = $btn.append("i")
          .classed({fa: 1, "fa-fw": 1})
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
    this.tree.commit();
  }

  appendSlide(id=null, after=null){
    console.log("append", id, after);
    let slides = this.sortedSlides(),
      prev,
      next;

    if(!after){
      prev = null;
      next = slides.length ? slides[0].key : null;
    }else{
      prev = this.slides.get([after]);
      next = prev.next;
      prev = prev.id;
    }

    if(!id){
      id = this.nextId();
      this.slides.set(id, {id});
    }

    console.log(id, prev, next);

    this.slides.set([id, "prev"], prev);
    this.slides.set([id, "next"], next);

    prev && this.slides.set([prev, "next"], id);
    next && this.slides.set([next, "prev"], id);
  }

  show(){
    this.visible.set(!this.visible.get());
    this.update();
  }

  update(){
    let visible = this.visible.get();
    this.$view.classed({offscreen: !visible});
    d3.select("#notebook-container")
      .style({
        width: visible ? "auto" : null,
        "margin-right": visible ? "220px" : null,
        "margin-left": visible ? "20px" : null,
      });


    let $slide = this.$slides.selectAll(".slide_thumb")
      .data(this.tree.get("slides"), d => d.id);

    $slide.enter()
      .append("div")
      .classed({slide_thumb: 1});
  }
}

export {Sorter};
