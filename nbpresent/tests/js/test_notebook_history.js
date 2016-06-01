/* global casper */
casper.notebook_test(function(){
  casper.screenshot.init("history");
  casper.viewport(1440, 900)
    .then(basic_test);
});

function basic_test(){
  this.baseline_notebook();

  this.canSeeAndClick([
      ["the sorter button", "#nbp-app-btn"],
      ["the history button", ".nbp-app-bar .fa-history"]
    ])
    .wait(500)
    .canSeeAndClick([
      ["the initial load", ".nbp-snapshot .fa-gift"]
    ]);
}
