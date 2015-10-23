import d3 from "d3";

let fn = d3.functor;

class Toolbar {
  constructor(){
    this._btnClass = fn("btn-default btn-xs");
    this._btnGroupClass = fn("btn-group");
    this.update = this.update.bind(this);
  }

  btnClass(val){
    return arguments.length ?
      [this._btnClass = fn(val), this][1] :
      this._btnClass;
  }

  btnGroupClass(val){
    return arguments.length ?
      [this._btnGroupClass = fn(val), this][1] :
      this._btnGroupClass;
  }

  update($selection){
    $selection.classed({"btn-toolbar": 1});

    let $group = $selection.selectAll(".btn-toolbar-group")
      .data((d) => d)

    $group.enter()
      .append("div")
      .classed({"btn-toolbar-group": 1})
      .classed(this._btnGroupClass(), 1);

    let $btn = $group.selectAll(".btn")
      .data((d) => d)

    $btn.enter()
      .append("a")
      .attr("class", (d) => {
        return `btn ${this._btnClass(d)}`
      })
      .append("i");

    $btn
      .on("click", (d) => d.click() )
      .attr({
        title: (d) => d.tip
      })
      .select("i")
      .attr({
        "class": (d) => `fa fa-fw fa-${d.icon}`,
      });
  }
}

export {Toolbar};
