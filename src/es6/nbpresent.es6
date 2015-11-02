import $ from "jquery";

import d3 from "d3";
import Baobab from "baobab";

import Jupyter from "base/js/namespace";

import {Presenter} from "./presenter";
import {Sorter} from "./sorter";
import {CellToolbar} from "notebook/js/celltoolbar";

export class NBPresent {
  constructor() {
    this.tree = new Baobab({
      slides: this.metadata().slides,
      presenter: {},
      sorter: {},
      editor: {},
      sortedSlides: Baobab.monkey(["slides"], this.sortedSlides)
    });

    this.slides = this.tree.select(["slides"]);
    this.slides.on("update", () => this.metadata(true))

    this.presenter = new Presenter(this.tree);
    this.sorter = new Sorter(this.tree);

    this.initToolbar();
  }

  metadata(update){
    let md = Jupyter.notebook.metadata;
    if(update){
      md.nbpresent = {
        slides: this.slides.serialize()
      };
    }else{
      return md.nbpresent || {
        slides: {}
      }
    }
  }

  sortedSlides(slidesMap){
    let slides = d3.entries(slidesMap);

    slides.sort(
      (a, b) => (a.value.prev === null) || (a.key === b.value.prev) ? -1 : 1
    )

    return slides;
  }

  show(){
    this.sorter.show();
    $('#header-container').toggle();
    $('.header-bar').toggle();
  }

  initToolbar() {
    $("#view_menu").append($("<li/>").append($("<a/>")
      .text("Toggle Present")
      .on("click", ()=>{
        this.show();
      })));

    // TODO: make this one button!
    Jupyter.toolbar.add_buttons_group([
      {
        label: "Slide Sorter",
        icon: "fa-th-large",
        callback: () => this.show(),
        id: "nbpresent_sorter_btn"
      },
      {
        label: "Present",
        icon: "fa-youtube-play",
        callback: () => this.tree.set(
          ["presenter", "presenting"],
          !this.tree.get(["presenter", "presenting"])
        ),
        id: "nbpresent_present_btn"
      }
    ]);
    let that = this;

    var nbpresent_preset = [];
    var select_type = CellToolbar.utils.select_ui_generator([
        ["-"            ,"-"            ],
        ["Slide"        ,"slide"        ],
        ["Sub-Slide"    ,"subslide"     ],
        ["Fragment"     ,"fragment"     ],
        ["Skip"         ,"skip"         ],
        ["Notes"        ,"notes"        ]
      ],
      (cell, value) => {
        console.log(this, cell, value);
        // setter
      },
      (cell) => {
        //getter
        if(cell === Jupyter.notebook.get_selected_cell() &&
          !this.tree.get(["sorter", "visible"])
        ){
          console.log(this, cell);
          this.show();
        }
      },
      "nbpresent"
    );

  CellToolbar.register_callback('nbpresent.select', select_type);
  nbpresent_preset.push('nbpresent.select');

  CellToolbar.register_preset('nbpresent',nbpresent_preset, notebook);
  console.log('nbpresent extension for metadata editing loaded.');

  }


}
