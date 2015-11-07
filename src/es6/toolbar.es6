import {d3} from "nbpresent-deps";

let fn = d3.functor;

class Toolbar {
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
    $selection.classed({"btn-toolbar": 1});

    let $group = $selection.selectAll(".btn-toolbar-group")
      .data((d) => d)

    $group.enter()
      .append("div")
      .classed({"btn-toolbar-group": 1})
      .classed(this._btnGroupClass(), 1);

    let $btn = $group.selectAll(".btn")
      .data((d) => d, (d) => d.tip);

    $btn.enter()
      .append("a")
      .attr("class", (d) => {
        return `btn ${this._btnClass(d)}`
      })
      .attr({
        title: (d) => d.tip
      })
      .each(function(d){
        if(!$.fn.tooltip){
          return;
        }
        $(this).tooltip(that._tipOptions(d));
      })
      .append("i");

    $btn
      .on("click", (d) => d.click() )
      .select("i")
      .attr({
        "class": (d) => `fa fa-fw fa-${d.icon}`,
      });

    let clean = function(){
      $(this).tooltip("destroy");
    }

    $btn.filter((d) => d.visible && !d.visible())
      .each(clean)
      .remove();

    $btn.exit()
      .each(clean)
      .remove();
    $group.exit().remove();
  }
}

export {Toolbar};
