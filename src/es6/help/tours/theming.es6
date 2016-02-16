import {_, $} from "nbpresent-deps";

import {TourBase} from "./base";

import {ICON} from "../../icons";
import {THEMER} from "../../mode/notebook";


export class ThemingTour extends TourBase {
  static icon(){
    return ICON.themer;
  }

  steps(){
    return [{
      element: `.nbp-app-bar .fa-${ICON.themer}`,
      title: "Themes",
      content: "Themes change how Notebook content appears",
      placement: "left",
      onShow: () => _.defer(() => this.mode.mode.set(THEMER))
    }, {
      element: `.nbp-theme-previews h2`,
      title: "Your Themes",
      content: "By default, nbpresent won't change the base Notebook styles very much: all text will be very small!",
      placement: "bottom"
    }, {
      element: `.nbp-theme-manager .fa-${ICON.addTheme}`,
      title: "Empty Theme",
      content: "You can build a completely custom theme...",
      placement: "bottom"
    }, {
      element: `.nbp-theme-previews-canned h2`,
      title: "Stock Themes",
      content: "...or nbpresent provides a few themes for you to start with",
      placement: "bottom"
    }, {
      element: `.nbp-theme-preview-canned:first-of-type`,
      title: "A Sample Theme",
      content: "Let's use this theme",
      placement: "bottom",
      onHide: () => $(`.nbp-theme-preview-canned:first-of-type`).click()
    }, {
      element: `.nbp-default-theme .fa-${ICON.defaultThemeActive}`,
      title: "Default Theme",
      content: "Once you select your first theme, it becomes the default. You can change it later",
      placement: "bottom"
    }, {
      element: `.nbp-theme-editor-palette h2`,
      title: "Colors",
      content: "Colors are a great way to highlight content",
      placement: "bottom"
    }, {
      element: `.nbp-theme-editor-backgrounds h2`,
      title: "Backgrounds",
      content: "Backgrounds appear behind all Slide Regions",
      placement: "bottom"
    }, {
      element: `.nbp-theme-editor-backgrounds .fa-image`,
      title: "Background Image",
      content: `Any Image which is actually pushed to the notebook, like matplotlib and bokeh, can be used as backgrounds. Once loaded, we'll even grab the "pretty" colors from it!`,
      placement: "bottom"
    }, {
      element: `.nbp-theme-editor-backgrounds .fa-square`,
      title: "Background Color",
      content: "Or, any color in the Palette can be used as a background",
      placement: "bottom"
    }, {
      element: `.nbp-theme-rules h2`,
      title: "Typography",
      content: "Typography is the heart of what your users will see",
      placement: "bottom"
    }, {
      element: `.nbp-theme-base-font .nbp-selector-label`,
      title: "∅: Base Type",
      content: "The ∅, or Base, type will override most other font choices",
      placement: "bottom"
    }, {
      element: `.nbp-theme-base-font .nbp-selector-font-size`,
      title: "∅: Size",
      content: "Increasing the base type size is the easiest way to make your Notebook a more appealing presentation",
      placement: "bottom"
    }, {
      element: `.nbp-theme-base-font .nbp-selector-font-name`,
      title: "∅: Font",
      content: "While you can't use locally-installed fonts, you can pick from a large number of web fonts to set as the base font",
      placement: "bottom"
    }, {
      element: `.nbp-theme-base-font .nbp-selector-color`,
      title: "∅: Color",
      content: "You can pick a color from your palette to apply to all type",
      placement: "bottom"
    }, {
      element: `.nbp-theme-editor-toolbar .fa-${ICON.showRules}`,
      title: "All/Active",
      content: "Click here to toggle between all available HTML type elements, or just those that actually appear in your notebook",
      placement: "bottom"
    }, {
      element: `.nbp-theme-editor-toolbar .fa-${ICON.preview}`,
      title: "Preview",
      content: "If you are Presenting, you can fade out the theme editor to see a live preview of the current slide",
      placement: "bottom"
    }, {
      title: "FIN",
      content: "Thanks for watching! Go make some great themes!",
      placement: "bottom"
    }];
  }
}
