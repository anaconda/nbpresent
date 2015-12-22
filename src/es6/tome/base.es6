/** The base class for automated slide creators */
export class BaseTome {
  /** construct a new tome, set up for a slide */
  constructor(sorter){
    this.sorter = sorter;
  }

  relevant(){
    return true;
  }

  study(){
    return [];
  }

  execute(){
    this.study().map((d)=>{
      this.sorter.slides.set([d.id], d);
    });
  }
}
