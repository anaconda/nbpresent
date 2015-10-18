import d3 from "d3";
import Jupyter from "base/js/namespace";

var {notebook} = Jupyter;

class Presenter {
  constructor(tree) {
    this.tree = tree;
    this.presenting = false;
    this.drag = d3.behavior.drag()
      .on("drag", this.dragging);
  }

  dragging(d) {
    console.log(this);
  }

  present() {
    let p = this.presenting = !this.presenting,
      doc = document.documentElement;

    // rebind with d3
    let cell = d3.selectAll(notebook.get_cell_elements())
      .data(notebook.get_cells());

    cell.select(".input_area")
      .style({
        position: p ? "absolute" : null,
        display: p ? "block" : "flex",
        left: () => p ? Math.random() * doc.clientWidth + "px" : null,
        top:  () => p ? Math.random() * doc.clientHeight + "px" : null,
      })
      //.call(this.drag);

    cell.select("")

    console.log(cell.data());
  }
}

export {Presenter};
