casper.notebook_test(function(){
  casper.screenshot.init("create");
  casper.viewport(1440, 900)
    .then(create_test);
});

function create_test(){
  _ = this.vendor._;

  this.baseline_notebook();

  this
    .canSeeAndClick("the sorter button", "#nbp-app-btn")
    .canSeeAndClick("the add slide button",
      ".nbp-deck-toolbar .fa-plus-square-o")
    .canSeeAndClick("a slide template in the library",
      ".nbpresent_template_library .slide")
    .waitWhileVisible(".nbpresent_template_library")
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
    .canSeeAndClick("a region in the sorter", ".slides_wrap .slide .region")
    .canSeeAndClick("input link button",
      ".region_toolbar .fa-terminal")
    .canSeeAndClick("a free region in the sorter",
      ".slides_wrap .slide .region:not(.content_source)")
    .canSeeAndClick("output link button",
      ".region_toolbar .fa-image")
    .canSeeAndClick("the presenter button", "#nbpresent_present_btn")
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
    .canSeeAndClick("the presenter button", "#nbpresent_present_btn")
    .canSeeAndClick("the presenter", ".nbp-presenter")
}
