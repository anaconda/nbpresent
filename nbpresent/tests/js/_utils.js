;(function(){
  "use strict";
  var root = this.nbpresent_utils ? this.nbpresent_utils :
    this.nbpresent_utils = {};

  var img = 0;

  root.screenshot = function(){
    this.captureSelector("screenshots/capture_" + (img++) + ".png", "body");
  }

  root.canSeeAndClick = function(message, visible, click){
    return this
      .waitUntilVisible(visible)
      .then(function(){
        t.assertExists(click || visible, "I can see and click " + message);
        this.click(click || visible);
      });
  }

}).call(this);
