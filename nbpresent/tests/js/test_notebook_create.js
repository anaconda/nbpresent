/* global casper */

casper.notebook_test(function(){
  casper.screenshot.init("create");
  casper.viewport(1440, 900)
    .then(create_test);
});

function create_test(){
  var _ = this.vendor._,
    freeRegion = ".nbp-slides-wrap .slide .nbp-region.nbp-content-null";

  this.baseline_notebook();

  this.canSeeAndClick([
      ["the sorter button", "#nbp-app-btn"],
      ["the slides button", ".nbp-app-bar .fa-film"],
      ["the add slide button", ".nbp-deck-toolbar .fa-plus-square-o"],
      ["a slide template in the library",
        ".nbp-template-library .slide:last-of-type"]
    ])
    .waitWhileVisible(".nbp-template-library")
    .saveNbpresent()
    .hasMeta("nbpresent.slides", {
      "one slide": function(slides){
        return [_(slides).toArray().value().length, 1];
      },
      "four regions": function(slides){
        var regions = _(_(slides).toArray().first().regions)
          .toArray()
          .value();
        return [regions.length, 4];
      }
    })
    .canSeeAndClick([
      ["a region in the sorter", ".nbp-slides-wrap .slide .nbp-region"],
      ["the link mode button", ".nbp-region-toolbar .fa-link"],
      ["a linkable source", ".nbp-part-overlay-source"],
      ["a region in the sorter", freeRegion],
      ["the link mode button", ".nbp-region-toolbar .fa-link"],
      ["a linkable output", ".nbp-part-overlay-outputs"],
      ["a region in the sorter", freeRegion],
      ["the link mode button", ".nbp-region-toolbar .fa-link"],
      ["a linkable widget", ".nbp-part-overlay-widgets"],
      ["a region in the sorter", freeRegion],
      ["the link mode button", ".nbp-region-toolbar .fa-link"],
      ["a linkable whole", ".nbp-part-overlay-whole"],
      ["the presenter button", "#nbp-present-btn"],
      ["the presenter", ".nbp-presenter"]
    ])
    .then(function(){
      return this.mouse.move(1430, 890);
    })
    .wait(1)
    .canSeeAndClick([
      ["the return to notebook button", ".fa-book"],
      ["the edit button", ".nbp-deck-toolbar .fa-edit"],
      ["a region in the region tree", ".nbp-regiontree .nbp-region"],
      ["the treemap layout button", ".nbp-regiontree .fa-tree"],
      ["the weight attribute", ".attr_name"]
    ])
    .dragRelease("the weight attribute", ".attr_name", {right: 50})
    .canSeeAndClick("the manual layout button", ".nbp-regiontree .fa-arrows")
    .dragRelease("a draggable region",
      ".nbp-editor .nbp-region.active .nbp-region-bg", {right: 50})
    .canSeeAndClick([
      ["the exit edit mode button", ".fa-chevron-circle-down"],
      ["the sorter button", "#nbp-app-btn"]
    ])
    .waitWhileVisible(".nbp-sorter")
    .waitWhileVisible(".nbp-regiontree")
    .canSeeAndClick([
      ["the presenter button", "#nbp-present-btn"],
      ["the presenter", ".nbp-presenter"]
    ]);
}
