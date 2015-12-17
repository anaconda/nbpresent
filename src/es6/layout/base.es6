export class BaseLayout {
  constructor(tree, slide, container){
    this.tree = tree;
    this.slide = slide;
    this.container = container;
  }

  attrDefaults() {
    return {};
  }

  regions() {
    return d3.entries(this.slide.value.regions);
  }

  init(){
    // initialize missing values
    this.initAttrs();
  }

  initAttrs(){
    // initialize missing values
    let regions = this.regions();

    d3.entries(this.attrDefaults())
      .map(({key, value}) => {
        regions
          .filter((d) => d.value.attrs[key] == null)
          .map((d) => {
            var attrs = {};
            attrs[key] = value;
            console.log(attrs);
            this.tree.merge(
              ["slides", this.slide.key, "regions", d.key, "attrs"],
              attrs
            );
          });
        });
  }

  clean(unpresent){
    unpresent.style({
      left: null,
      top: null,
      width: null,
      height: null
    });
  }

  update(region, part){
    let {x, y, width, height, z} = region.value.attrs;

    z = z || 0;

    part.style({
      height: `${this.y(height)}px`,
      left: `${this.x(x)}px`,
      top: `${this.y(y)}px`,
      width: `${this.x(width)}px`
    });
  }
}
