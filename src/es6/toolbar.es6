import d3 from "d3";

class Toolbar {
  update($selection){
    $selection.classed({
      "btn-toolbar": 1
    });

    let $group = $selection.selectAll(".btn-group")
      .data((d) => d)

    $group.enter()
      .append("div")
      .classed({"btn-group": 1});

    let $btn = $group.selectAll(".btn")
      .data((d) => d)

    $btn.enter()
      .append("a")
      .classed({btn: 1, "btn-default": 1, "btn-xs": 1})
      .append("i");

    $btn
      .each(function(d){
        let $btn = d3.select(this);
        Object.keys(d.on).map((key)=>{
          $btn.on(key, d.on[key]);
        });
      })
      .select("i")
      .attr("class", (d) => `fa fa-fw fa-${d.icon}`);
  }
}

export {Toolbar};
