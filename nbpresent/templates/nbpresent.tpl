{%- extends 'full.tpl' -%}


{% macro nbpresent_id(cell) -%}
  {% if cell.metadata.nbpresent %}
    data-nbpresent-id="{{ cell.metadata.nbpresent.id }}"
  {% endif %}
{%- endmacro %}


{% block codecell %}
  <div class="cell border-box-sizing code_cell rendered" {{ nbpresent_id(cell) }}>
    {{ super() }}
  </div>
{%- endblock codecell %}


{% block markdowncell scoped %}
  <div class="cell border-box-sizing text_cell rendered" {{ nbpresent_id(cell) }}>
    {{ self.empty_in_prompt() }}
    <div class="inner_cell">
      <div class="text_cell_render border-box-sizing rendered_html">
      {{ cell.source  | markdown2html | strip_files_prefix }}
      </div>
    </div>
  </div>
{%- endblock markdowncell %}


{%- block html_head -%}
  <meta charset="utf-8" />
  <title>{{resources['metadata']['name']}}</title>

  <script src="./require.js"></script>
  <script src="./jquery.min.js"></script>

  {% for css in resources.inlining.css -%}
      <style type="text/css">
      {{ css }}
      </style>
  {% endfor %}

  <style type="text/css">
  /* Overrides of notebook CSS for static HTML export */
  body {
    overflow: visible;
    padding: 8px;
  }

  div#notebook {
    overflow: visible;
    border-top: none;
  }

  @media print {
    div.cell {
      display: block;
      page-break-inside: avoid;
    }
    div.output_wrapper {
      display: block;
      page-break-inside: avoid;
    }
    div.output {
      display: block;
      page-break-inside: avoid;
    }
  }
  </style>

  <!-- Custom stylesheet, it must be in the same directory as the html file -->
  <link rel="stylesheet" href="custom.css">

  <!-- Loading mathjax macro -->
  {{ mathjax() }}
{%- endblock html_head -%}


{% block body %}
  {{ super() }}

  <script type="application/json" id="nbpresent_tree">
    {{ resources.nbpresent.metadata }}
  </script>
  <script>
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
    if (!Function.prototype.bind) {
      Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
          // closest thing possible to the ECMAScript 5
          // internal IsCallable function
          throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
              return fToBind.apply(this instanceof fNOP
                     ? this
                     : oThis,
                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
          // native functions don't have a prototype
          fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
      };
    }
  </script>
  <script>
    ;(function(){
      requirejs({
        paths: {
          jquery: [
            "./jquery.min",
            "components/jquery/jquery.min"
          ]
        }
      }, [
        "jquery",
        "./nbpresent.min.js"
      ], function($, loader){
        loader.load_presentation_standalone();
      }, function(err){
        console.error("\n>>>NBPRESENT REQUIRE ERROR" + JSON.stringify(err) + "\n\n")
      });

    }).call(this);
  </script>
{% endblock body %}
