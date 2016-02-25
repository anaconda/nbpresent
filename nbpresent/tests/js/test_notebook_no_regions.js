/* global casper */

casper.notebook_test(function(){
  casper.screenshot.init("empty");
  casper.viewport(1440, 900)
    .then(empty_test);
});

var freeRegion = ".nbp-slides-wrap .slide .nbp-region.nbp-content-null";


function empty_test(){
  var _ = this.vendor._;

  this.baseline_notebook();

  this.canSeeAndClick([
      ["the sorter button", "#nbp-app-btn"],
      ["the slides button", ".nbp-app-bar .fa-film"],
      ["the add slide button", ".nbp-deck-toolbar .fa-plus-square-o"],
      ["a slide template in the library",
        ".nbp-template-library .slide:first-of-type"]
    ])
    .waitWhileVisible(".nbp-template-library")
    .canSeeAndClick([
      ["the edit button", ".nbp-deck-toolbar .fa-edit"],
      ["a region in the sorter", freeRegion],
      ["the unlink button", ".nbp-region-toolbar .fa-trash"]
    ])
    .saveNbpresent()
    .waitWhileSelector([
        ".nbp-slides-wrap .slide .nbp-region",
        ".nbp-regiontree .nbp-region",
        ".nbp-editor .nbp-region"
      ].join(", "))
    .hasMeta("nbpresent.slides", {
      "one slide": function(slides){
        return [_(slides).toArray().value().length, 1];
      },
      "no regions": function(slides){
        var regions = _(_(slides).toArray().first().regions)
          .toArray()
          .value();
        return [regions.length, 0];
      }
    })
    .canSeeAndClick([
      ["fin", "body"]
    ])

}
