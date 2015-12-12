;(function(){
  "use strict";
  var root = this.nbpresent ? this.nbpresent : this.nbpresent = {};

  var img = 0;

  root.screenshot = function(){
    this.captureSelector("screenshots/capture_" + (img++) + ".png", "body");
  }

}).call(this);
