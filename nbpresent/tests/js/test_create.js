var t = casper.test;

function create_test(){
  var img = 0;

  var screenshot = nbpresent_utils.screenshot.bind(this);

  this.canSeeAndClick = nbpresent_utils.canSeeAndClick.bind(this);

  // the actual test
  this
    .canSeeAndClick("the sorter button", "#nbpresent_sorter_btn")
    .canSeeAndClick("the tour",
      ".tour-nbpresent", ".tour-nbpresent .popover-navigation > .btn")
    .waitWhileVisible(".tour-nbpresent")
    .canSeeAndClick("the add slide button", ".deck_toolbar .fa-plus-square-o")
    .canSeeAndClick("a slide in the library",
      ".nbpresent_template_library .slide")
    .waitWhileVisible(".nbpresent_template_library")
    .canSeeAndClick("the edit button", ".deck_toolbar .fa-edit")
    .canSeeAndClick("a region in the region tree",
      ".nbpresent_regiontree .region")
}


casper.notebook_test(function(){
  casper.viewport(1440, 900)
    .then(create_test);
});
