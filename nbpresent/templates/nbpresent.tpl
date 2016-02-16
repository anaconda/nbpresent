{%- extends 'full.tpl' -%}


{% macro nbpresent_id(cell) -%}
  {% if cell.metadata.nbpresent %}
    data-nbp-id="{{ cell.metadata.nbpresent.id }}"
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
  </style>

  <!-- inlined css -->
  {% for fname, css in resources.nbpresent_assets.css.items() -%}
    <style>/* {{ fname }} */
      {{ css }}
    </style>
  {% endfor %}

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">

  <!-- Loading mathjax macro -->
  {{ mathjax() }}

  {% for fname, js in resources.nbpresent_assets.js.items() -%}
    <script>/* {{ fname }} */
      {{ js }}
    </script>
  {% endfor %}


  <script type="application/json" id="nbpresent_tree">
    {{ resources.nbpresent.metadata }}
  </script>

{%- endblock html_head -%}
