var t = casper.test;

function create_test(){
  var img = 0;

  var screenshot = (function(){
    this.captureSelector("screenshots/capture_" + (img++) + ".png", "body");
  }).bind(this);

  // the actual test
  this
    .waitUntilVisible("#nbpresent_sorter_btn")
    .then(function(){
      this.click("#nbpresent_sorter_btn");
    })
    .waitUntilVisible(".tour-nbpresent")
    .then(function(){
      screenshot();
      this.click(".tour-nbpresent .popover-navigation > .btn");
    })
    .waitWhileVisible(".tour-nbpresent")
    .waitUntilVisible(".nbpresent_sorter")
    .then(function(){
      screenshot();
      this.click(".deck_toolbar .fa-plus-square-o");
    })
    .waitUntilVisible(".nbpresent_template_library")
    .then(function(){
      screenshot();
      this.click(".nbpresent_template_library .slide");
    })
    .waitWhileVisible(".nbpresent_template_library")
    .waitUntilVisible(".slides_wrap .slide")
    .then(function(){
      screenshot();
      this.click(".deck_toolbar .fa-edit");
    })
    .waitUntilVisible(".nbpresent_regiontree")
    .then(function(){
      screenshot();
      this.click(".nbpresent_regiontree .region");
    });
}


casper.notebook_test(function(){
  casper.viewport(1440, 900).then(create_test);
});
