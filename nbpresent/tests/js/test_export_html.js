var system = require('system'),
  host = system.env.NBPRESENT_TEST_HTTP_HOST || "localhost",
  port = system.env.NBPRESENT_TEST_HTTP_PORT || 8000,
  root = "http://" + host + ":" + port + "/";

casper.test.begin("Does exported HTML look okay?", function(test){
  casper.start(root, function(){
    casper.screenshot.init("export_html");
    casper.viewport(1440, 900)
      .then(export_test);
  }).run(function(){
    test.done();
  });
});

function export_test(){
  this.then(function(){
    return this.canSeeAndClick("body", "body.nbpresent_presenting");
  });
}
