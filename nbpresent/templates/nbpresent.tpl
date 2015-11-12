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


{% block html_head %}
  {{ super() }}
  {% for css in resources.nbpresent_inline.css -%}
    <style>
      {{ css }}
    </style>
  {% endfor %}
{% endblock html_head %}


{% block body %}
  {{ super() }}

  <script type="application/json" id="nbpresent_tree">
    {{ resources.nbpresent.metadata }}
  </script>
  <script>
    ;(function(){
      requirejs.config({
        paths: {
          "nbpresent-loader": [
            "./nbpresent.min",
            "/nbextensions/nbpresent/nbpresent.min",
            "https://continuumio.github.io/nbpresent/nbpresent/nbpresent.min"
          ],
          jquery: [
            "http://localhost:8888/components/jquery/jquery.min"
          ]
        }
      });

      requirejs(["jquery", "nbpresent-loader"], function($, loader){
        loader.load_presentation_standalone();
      });

    }).call(this);
  </script>
{% endblock body %}
