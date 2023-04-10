// Assets
import "./assets";

// Styles
import "../styles/index.scss";

// Modules
import { Map } from "./Map";
import { Club } from "./types";
import clubsById from "../../generated/clubs.json";
import animateScrollTo from "animated-scroll-to";

class Homepage {
  constructor() {
    this.setClubOfTheDay();
    this.setPostOfTheDay();
  }

  setClubOfTheDay = () => {
    const clubOTDEl = document.getElementById("club-otd");

    const dayUnix = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const clubs = Object.values(clubsById) as Club[];
    const clubIndex = dayUnix % clubs.length;
    const club = clubs[clubIndex];

    const regionStr = club.region ? `• ${club.region} •` : "•";
    const area = `${club.metro} ${regionStr} ${club.country}`;

    clubOTDEl.innerHTML = `
      <a href="/map/${club.id}">
        <h4 data-type="title-s">${club.name}</h4>
      </a>
      <label data-type="body-s">${area}</label>
    `;
  };

  setPostOfTheDay = () => {};
}

if (location.pathname === "/") {
  new Homepage();
}

if (location.pathname.indexOf("/map") === 0) {
  new Map();
}

const vw = window.innerWidth;
if (vw < 768) {
  const instructionEl = document.getElementById("swipe-instruction");
  document.scrollingElement.scrollLeft = vw;
  document.body.dataset.loaded = "true";

  let timeout: number;
  window.addEventListener("scroll", (e) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      const scrollX = document.scrollingElement.scrollLeft;
      const showContent = scrollX > 200;
      animateScrollTo([showContent ? vw : 0, null], {
        elementToScroll: document.scrollingElement,
      });
      instructionEl.textContent = showContent
        ? "swipe for menu →"
        : "← swipe for content";
    }, 100);
  });
} else {
  document.body.dataset.loaded = "true";
}
