import {d3} from "nbpresent-deps";

const PART = {
  source: "source",
  outputs: "outputs",
  widgets: "widgets",
  whole: "whole"
};

const PART_SELECT = {
  source: ".inner_cell",
  outputs: ".output_wrapper",
  widgets: ".widget-area .widget-subarea",
  whole: null
};

let partColor = d3.scale.ordinal()
  .domain(d3.values(PART))
  .range(["blue", "red", "purple", "orange"]);

export {PART, PART_SELECT, partColor};
