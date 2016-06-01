import {d3, _} from "nbpresent-deps";


export class Historian {
  constructor(tree, {mode}){
    this.tree = tree;
    this.mode = mode;

    this.head = this.tree.select(["history", "head"]);
    this.snapshots = this.tree.select(["history", "snapshots"]);

    this.watcher = this.tree.watch({
      head: this.head,
      snapshots: this.snapshots
    });
    this.watcher.on("update", () => this.update());

    this.initUI();
    _.delay(() => {
      this.$body.classed({"nbp-curating": 1});
      this.update();
    }, 10);
  }

  initUI(){
    this.$body = d3.select("body");
    this.$ui = this.$body.append("div")
      .classed({"nbp-historian": 1});

    this.$h2 = this.$ui.append("h2")
      .text("history ")

    this.$h2.append("hr");

    this.$shots = this.$ui.append("div")
      .classed({"nbp-snapshots": 1});
  }

  update(){
    let history = this.watcher.get(),
      snapshots = _.sortBy(d3.entries(history.snapshots), "key").reverse(),
      prevHead = history.head,
      headLogIds = [null, history.head],
      prevShot;

    while(prevHead){
      prevShot = history.snapshots[prevHead];
      prevHead = prevShot && prevShot.parent;
      prevHead && headLogIds.push(prevHead);
    }

    let $shot = this.$shots.selectAll(".nbp-snapshot")
      .data(snapshots);

    $shot.enter().append("div")
      .classed({"nbp-snapshot": 1})
      .append("button")
      .classed({"btn btn-default": 1})
      .on("click", (d) => this.rollback(d))
      .call((btn) => {
        btn.append("i").classed({"fa fa-fw": 1});
        btn.append("span");
      });

    $shot.exit().remove();

    $shot.classed({
        "nbp-history-head": (d) => d.key === history.head,
        "nbp-history-not-head-parent": (d) => headLogIds.indexOf(d.key) === -1
      })
      .select("button")
      .call((btn) => {
        btn.select("span")
          .text((d) => d.value.message)
        btn.select("i")
          .attr("class", (d) => `fa fa-fw fa-${d.value.icon}`)
      })

    return this;
  }

  rollback(snapshotEntry){
    this.head.set(snapshotEntry.key);
    this.tree.set(["slides"], snapshotEntry.value.state.slides);
    this.tree.set(["themes"], snapshotEntry.value.state.themes);
  }

  destroy(){
    this.$body.classed({"nbp-curating": 0});
    this.watcher.release();
    _.delay(() => this.$ui.remove(), 500);
  }
}
