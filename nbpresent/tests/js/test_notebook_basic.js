casper.notebook_test(function(){
  casper.screenshot.init("basic");
  casper.viewport(1440, 900)
    .then(basic_test);
});

function basic_test(){
  var t = casper.test;

  this.baseline_notebook();

  this.then(function(){
      this.canSeeAndClick("the body", "body");
    })
    .then(function(){
      ["#nbp-app-btn",
        "#nbpresent_present_btn",
        ".download_nbpresent_html",
        ".download_nbpresent_pdf"
      ].map(function(selector){ t.assertExists(selector); });

      loaded("nbpresent.min.css");
    });

  // TODO: move to utils?
  function loaded(pattern){
    t.assertResourceExists(function(resource) {
      return resource.url.match(pattern);
    });
  };
}
