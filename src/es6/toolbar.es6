import {d3, $, _} from "nbpresent-deps";

let fn = d3.functor;

export class Toolbar {
  constructor(){
    this._btnClass = fn("btn-default");
    this._btnGroupClass = fn("btn-group");
    this._tipOptions = fn({container: "body"});

    this.update = this.update.bind(this);
  }

  btnClass(val){
    return arguments.length ?
      [this._btnClass = fn(val), this][1] :
      this._btnClass;
  }

  tipOptions(val){
    return arguments.length ?
      [this._tipOptions = fn(val), this][1] :
      this._tipOptions;
  }

  btnGroupClass(val){
    return arguments.length ?
      [this._btnGroupClass = fn(val), this][1] :
      this._btnGroupClass;
  }

  update($selection){
    let that = this;
    $selection.classed({"btn-toolbar nbp-toolbar": 1});

    let $group = $selection.selectAll(".btn-toolbar-group")
      .data((d) => d)

    $group.enter()
      .append("div")
      .classed({"btn-toolbar-group": 1})
      .classed(this._btnGroupClass(), 1);

    let $btn = $group.selectAll(".btn")
      .data((d) => d);

    $btn.enter()
      .append("a")
      .classed({btn: 1})
      .call(($btn)=>{
        $btn.append("i");
        $btn.append("label");
      });

    $btn.attr({
        "class": (d) => `btn ${this._btnClass(d)}`,
        title: (d) => d.tip || d.label
      })
      .each(function(d){
        if(!$.fn.tooltip){
          return;
        }
        try {
          $(this).tooltip("destroy");
        } catch(err) {
          // whatever, jquery
        }
        d.tip && $(this).tooltip(that._tipOptions(d));
      })
      .on("click", (d) => d.click());

    // regular icons
    $btn.select("i")
      .filter(({icon}) => _.isString(icon))
      .attr({
        "class": ({icon}) => `fa fa-fw fa-2x fa-${icon}`
      })
      .selectAll("i").remove();

    // handle stacked icons
    let stacked = $btn.select("i")
      .filter(({icon}) => !_.isString(icon))
      .attr({"class": "fa-stack"})
      .selectAll("i")
      .data((d) => d.icon.map(() => d));

    stacked.exit().remove();

    stacked.enter().append("i");

    stacked.attr({"class": ({icon}, i) => `fa fa-${icon[i]}`});

    $btn.select("label")
      .text(({label}) => label);

    $btn.filter((d) => d.visible && !d.visible())
      .remove();

    $btn.exit()
      .remove();

    $group.exit().remove();
  }
}
