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
    const titleEl = document.getElementsByClassName("club-otd-title")[0];
    const locationEl = document.getElementsByClassName("club-otd-location")[0];

    const dayUnix = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const clubs = Object.values(clubsById) as Club[];
    const clubIndex = dayUnix % clubs.length;
    console.log(dayUnix, clubIndex);
    const club = clubs[clubIndex];

    titleEl.textContent = club.name;
    locationEl.textContent = `${club.metro} ${
      club.region ? `• ${club.region} •` : "•"
    } ${club.country}`;
  };

  setPostOfTheDay = () => {
    const titleEl = document.getElementsByClassName("club-otd-title")[0];
    const locationEl = document.getElementsByClassName("club-otd-location")[0];

    const dayUnix = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const clubs = Object.values(clubsById) as Club[];
    const clubIndex = dayUnix % clubs.length;
    console.log(dayUnix, clubIndex);
    const club = clubs[clubIndex];

    titleEl.textContent = club.name;
    locationEl.textContent = `${club.metro} ${
      club.region ? `• ${club.region} •` : "•"
    } ${club.country}`;
  };
}

if (location.pathname === "/") {
  new Homepage();
}

if (location.pathname.indexOf("/map") === 0) {
  new Map();
}

const vw = window.innerWidth;
if (vw < 768) {
  document.scrollingElement.scrollLeft = vw;

  let timeout: number;
  window.addEventListener("scroll", (e) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      const scrollX = document.scrollingElement.scrollLeft;
      animateScrollTo([scrollX > 200 ? vw : 0, null], {
        elementToScroll: document.scrollingElement,
      });
    }, 100);
  });
}
