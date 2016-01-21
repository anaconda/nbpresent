var system = require('system');

casper.test.begin("exported HTML", function(test){
  casper.start("http://localhost:8000/", function(){
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
