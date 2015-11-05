{%- extends 'full.tpl' -%}


{% macro nbpresent_id(cell) -%}
  {% if cell.metadata.nbpresent %}
    data-nbpresent-id="cell:{{ cell.metadata.nbpresent.id }}"
  {% endif %}
{%- endmacro %}


{% block codecell %}
  <div class="cell border-box-sizing code_cell rendered {{ nbpresent_id(cell) }}>
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
  <script>
    require(["./nbpresent/static/nbpresent/nbpresent.min"], function(nbpresent){
      console.log(nbpresent);
    })
  </script>
{% endblock body %}
