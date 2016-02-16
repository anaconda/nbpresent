import {SpeakerBase} from "./base";

export class NotebookSpeaker extends SpeakerBase {
  toolbarIcons(){
    return super.toolbarIcons().concat([
      [{
        icon: "book",
        click: () => this.presenting.set(false),
        label: "Notebook"
      }]
    ]);
  }
}
