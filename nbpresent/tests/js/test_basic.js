var t = casper.test;

// TODO: move to utils?
var loaded = function(pattern){
  t.assertResourceExists(function(resource) {
    return resource.url.match(pattern);
  });
};

casper.notebook_test(function(){
  ["#nbpresent_sorter_btn",
    "#nbpresent_present_btn",
    ".download_nbpresent_html",
    ".download_nbpresent_pdf"
  ].map(function(selector){ t.assertExists(selector); });

  loaded("nbpresent.min.css");
});
