casper.notebook_test(function(){
  casper.screenshot.init("create");
  casper.viewport(1440, 900)
    .then(create_test);
});

function create_test(){
  var _ = this.vendor._,
    freeRegion = ".nbp-slides-wrap .slide .region.nbp-content-null";

  this.baseline_notebook();

  this
    .canSeeAndClick("the sorter button", "#nbp-app-btn")
    .canSeeAndClick("the slides button", ".nbp-app-bar .fa-film")
    .canSeeAndClick("the add slide button",
      ".nbp-deck-toolbar .fa-plus-square-o")
    .canSeeAndClick("a slide template in the library",
      ".nbp-template-library .slide")
    .waitWhileVisible(".nbp-template-library")
    .hasMeta("nbpresent.slides", {
      "one slide": function(slides){
        return _(slides).toArray().value().length === 1;
      },
      "three regions": function(slides){
        var regions = _(_(slides).toArray()
          .first()
          .regions)
          .toArray()
          .value();
        return regions.length === 3;
      },
    })
    .canSeeAndClick("a region in the sorter", ".nbp-slides-wrap .slide .region")
    .canSeeAndClick("the link mode button", ".nbp-region-toolbar .fa-link")
    .canSeeAndClick("a linkable source", ".nbp-part-overlay-source")
    .canSeeAndClick("a region in the sorter", freeRegion)
    .canSeeAndClick("the link mode button", ".nbp-region-toolbar .fa-link")
    .canSeeAndClick("a linkable output", ".nbp-part-overlay-outputs")
    .canSeeAndClick("a region in the sorter", freeRegion)
    .canSeeAndClick("the link mode button", ".nbp-region-toolbar .fa-link")
    .canSeeAndClick("a linkable widget", ".nbp-part-overlay-widgets")
    .canSeeAndClick("a region in the sorter", freeRegion)
    .canSeeAndClick("the link mode button", ".nbp-region-toolbar .fa-link")
    .canSeeAndClick("a linkable whole", ".nbp-part-overlay-whole")
    .canSeeAndClick("the presenter button", "#nbp-present-btn")
    .canSeeAndClick("the presenter", ".nbp-presenter")
    .then(function(){
      return this.mouse.move(1430, 890);
    })
    .wait(1)
    .canSeeAndClick("the return to notebook button",
      ".fa-book")
    .canSeeAndClick("the edit button", ".nbp-deck-toolbar .fa-edit")
    .canSeeAndClick("a region in the region tree",
      ".nbp-regiontree .region")
    .canSeeAndClick("the treemap layout button",
      ".nbp-regiontree .fa-tree")
    .canSeeAndClick("the weight attribute", ".attr_name")
    .dragRelease("the weight attribute", ".attr_name", {right: 50})
    .canSeeAndClick("the manual layout button",
      ".nbp-regiontree .fa-arrows")
    .dragRelease("a draggable region",
      ".nbpresent_editor .region.active .region_bg", {right: 50})
    .canSeeAndClick("the exit edit mode button", ".fa-chevron-circle-down")
    .canSeeAndClick("the sorter button", "#nbp-app-btn")
    .waitWhileVisible(".nbp-sorter")
    .waitWhileVisible(".nbp-regiontree")
    .canSeeAndClick("the presenter button", "#nbp-present-btn")
    .canSeeAndClick("the presenter", ".nbp-presenter")
}
