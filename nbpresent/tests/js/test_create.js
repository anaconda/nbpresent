var t = casper.test;

function create_test(){
  var img = 0;

  var screenshot = nbpresent.screenshot.bind(this);
  
  // the actual test
  this
    .waitUntilVisible("#nbpresent_sorter_btn")
    .then(function(){
      t.assertExists("#nbpresent_sorter_btn", "the sorter button");
      this.click("#nbpresent_sorter_btn");
    })
    .waitUntilVisible(".tour-nbpresent")
    .then(function(){
      t.assertExists(".tour-nbpresent", "the tour");
      screenshot();
      this.click(".tour-nbpresent .popover-navigation > .btn");
    })
    .waitWhileVisible(".tour-nbpresent")
    .waitUntilVisible(".nbpresent_sorter")
    .then(function(){
      t.assertExists(".deck_toolbar .fa-plus-square-o", "the add slide button");
      screenshot();
      this.click(".deck_toolbar .fa-plus-square-o");
    })
    .waitUntilVisible(".nbpresent_template_library")
    .then(function(){
      t.assertExists(".nbpresent_template_library .slide", "the library");
      screenshot();
      this.click(".nbpresent_template_library .slide");
    })
    .waitWhileVisible(".nbpresent_template_library")
    .waitUntilVisible(".slides_wrap .slide")
    .then(function(){
      t.assertExists(".deck_toolbar .fa-edit", "the edit button");
      screenshot();
      this.click(".deck_toolbar .fa-edit");
    })
    .waitUntilVisible(".nbpresent_regiontree")
    .then(function(){
      t.assertExists(".nbpresent_regiontree", "the region tree");
      screenshot();
      this.click(".nbpresent_regiontree .region");
    });
}


casper.notebook_test(function(){
  casper.viewport(1440, 900)
    .then(create_test);
});
