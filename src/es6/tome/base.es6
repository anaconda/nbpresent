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
    console.debug(this, "execute!");
    this.study().map((d)=>{
      console.log(d);
    });
  }
}
