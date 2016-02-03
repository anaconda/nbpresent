({
    baseUrl: ".",
    paths: {
      "nbpresent-deps": "../../nbpresent/static/nbpresent/nbpresent.deps.min",
      "nbpresent-standalone": "../../nbpresent/static/nbpresent/nbpresent.standalone.min",
      "jquery" : "../../node_modules/jquery/dist/jquery",
      "underscore" : "../../node_modules/underscore/underscore"
    },
    name: "main",
    out: "../../nbpresent/static/nbpresent/nbpresent.static.min.js",
    preserveLicenseComments: true
})
