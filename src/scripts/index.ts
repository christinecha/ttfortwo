// Assets
import "./assets";

// Styles
import "../styles/index.scss";

// Modules
import { Map } from "./Map";

class Menu {
  el: HTMLElement;
  openButton: HTMLElement;
  closeButton: HTMLElement;
  isOpen: boolean;

  constructor() {
    this.el = document.getElementById("menu");
    this.openButton = document.getElementById("menu-trigger");
    this.closeButton = this.el.getElementsByClassName(
      "close-menu"
    )[0] as HTMLElement;

    this.openButton.addEventListener("click", () => {
      this.el.dataset.isOpen = "true";
    });

    this.closeButton.addEventListener("click", () => {
      this.el.dataset.isOpen = "false";
    });
  }
}

new Menu();
new Map();
