/* global casper require */

var system = require('system'),
  host = system.env.NBPRESENT_TEST_HTTP_HOST || "localhost",
  port = system.env.NBPRESENT_TEST_HTTP_PORT || 8000,
  root = "http://" + host + ":" + port + "/";

casper.test.begin("Does exported HTML look okay?", function(test){
  casper.start(root + "Basics.html", function(){
    casper.screenshot.init("export_html");
    casper.viewport(1440, 900, export_test)
  }).run(function(){
    test.done();
  });
});

function export_test(){
  return this.canSeeAndClick("body", "body.nbp-presenting")
    .canSeeAndClick("markdown", ".text_cell h1")
    .canSeeAndClick("code source", ".code_cell .input_area")
    .canSeeAndClick("code output", ".code_cell .output_text")
    .canSeeAndClick("svg container", ".code_cell .output_svg")
    .then(function(){ return this.mouse.move(1430, 890); })
    .wait(300)
    .canSeeAndClick("next slide button", ".fa-step-forward")
    .canSeeAndClick("embedded image", ".output_png")
    .then(function(){ return this.mouse.move(1430, 890); })
    .canSeeAndClick("previous slide button", ".fa-step-backward")
    .wait(300)
    .canSeeAndClick("fin", "body.nbp-presenting");
}
