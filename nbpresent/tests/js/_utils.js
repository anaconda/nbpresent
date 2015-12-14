;(function(){
  "use strict";
  var root = casper;

  var _img = 0;

  function nextId(){
    return ("000" + (_img++)).slice(-4);
  }

  function slug(text){
    return text.replace(/[^a-z0-9]/g, "_");
  }

  root.screenshot = function(message){
    this.captureSelector(
      "screenshots/" + nextId() + "_" + slug(message) + ".png",
      "body"
    );
  }

  root.canSeeAndClick = function(message, visible, click){
    return this
      .waitUntilVisible(visible)
      .then(function(){
        this.test.assertExists(click || visible, "I can see and click " + message);
        this.screenshot(message);
        this.click(click || visible);
      });
  }

  root.baseline_notebook = function(){
    // the actual test
    this.set_cell_text(0, [
      'from IPython.display import Markdown',
      'Markdown("# Hello World!")'
    ].join("\n"));
    this.execute_cell_then(0);

    this.append_cell();
    this.set_cell_text(1, [
      'from ipywidgets import FloatSlider',
      'x = FloatSlider()',
      'x'
    ].join("\n"));
    this.execute_cell_then(1);
  }

}).call(this);
