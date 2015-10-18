import d3 from "d3";

class Sorter {
  constructor(tree) {
    this.tree = tree;
    this.view = d3.select("body")
      .append("div")
      .classed({"nbpresent-sorter": 1});
  }
}

export {Sorter};
