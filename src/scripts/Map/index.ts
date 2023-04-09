import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// import { getGeocode, getLatLng } from "use-places-autocomplete";
// import { getDistance } from "geolib";
import clubsById from "../../../generated/clubs.json";
import {
  getCountryClubsHTML,
  getLngLat,
  getStars,
  sortAlphabetical,
} from "./util";
import { Club } from "../types";

// @ts-ignore
import clubInfoTemplate from "../../html/partials/club-info.hbs";

enum VIEW {
  MAP,
  LIST,
}

type onMapToolsChange = (props: { filteredClubs: any[] }) => void;

type Filter = {
  property: string;
  el: HTMLDivElement;
  options: string[];
};

export class Map {
  map: mapboxgl.Map;
  clubEls: HTMLUListElement[];
  mappableClubs: Club[];

  constructor() {
    const clubs = Object.values(clubsById) as any[];
    this.mappableClubs = clubs.filter((club) => {
      const clubLngLat = getLngLat(club);
      return !!clubLngLat;
    });

    this.initializeMap();
    this.initializeList();
    this.showActiveClub();
  }

  initializeMap = () => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2hyaXN0aW5lY2hhIiwiYSI6IjdhNTE1NjFjMWQ3YjU4Y2U3YmRjMjk5NGMwN2JlYjU4In0.VI-bJR7CeKOH-ZJpK4-9Ig";

    const zoom = window.innerWidth > 1000 ? 0.8 : 0.6;

    this.map = new mapboxgl.Map({
      container: "mapbox-container", // container ID
      style: "mapbox://styles/christinecha/clg8p5wit003401oxr5ljv9mb", // style URL
      center: [-73.7893326442353, 41.1326998386741], // wttc
      zoom, // starting zoom
    });

    this.mappableClubs.forEach((club) => {
      const clubLngLat = getLngLat(club);
      const markerEl = document.createElement("div");
      markerEl.dataset.id = club.id;
      markerEl.dataset.stars = String(getStars(club));
      markerEl.classList.add("marker");

      markerEl.addEventListener("click", () => {
        this.setActiveClub(club.id);
        this.centerClub(club.id);
      });

      // Create a new marker.
      new mapboxgl.Marker({
        element: markerEl,
        anchor: "bottom",
      })
        .setLngLat(clubLngLat)
        .addTo(this.map);
    });
  };

  initializeList = () => {
    const clubListEl = document.getElementById("club-list");
    const clubsByCountry: Record<string, Club[]> = {};
    this.mappableClubs.forEach((club) => {
      clubsByCountry[club.country] = clubsByCountry[club.country] || [];
      clubsByCountry[club.country].push(club);
    });

    const countries = Object.keys(clubsByCountry);
    countries.sort(sortAlphabetical).forEach((country) => {
      const clubs = clubsByCountry[country];
      const countryEl = document.createElement("div");
      countryEl.classList.add("country");
      const html = getCountryClubsHTML(country, clubs);
      countryEl.innerHTML = html;
      clubListEl.appendChild(countryEl);
    });

    clubListEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!target?.classList.contains("club")) return;
      this.centerClub(target.dataset.id);
      this.setActiveClub(target.dataset.id);
    });

    const viewAllButton = document.getElementById("view-all-clubs");
    viewAllButton.addEventListener("click", () => {
      this.setActiveClub(undefined);
    });
  };

  centerClub = (clubId: string) => {
    const club = this.mappableClubs.find((c) => c.id === clubId);
    if (!club) return;
    const { lat, lng } = club as any;
    const clubLngLat = new mapboxgl.LngLat(parseFloat(lng), parseFloat(lat));
    this.map.setCenter(clubLngLat);
    this.map.zoomTo(10);

    const markers = Array.from(document.getElementsByClassName("marker"));
    markers.forEach((m: HTMLDivElement) => {
      m.dataset.isActive = String(m.dataset.id === clubId);
    });
  };

  setActiveClub = (clubId: string) => {
    const isValid = clubId && this.mappableClubs.some((c) => c.id === clubId);

    if (isValid) {
      window.history.pushState({}, "", `/map/${clubId}`);
    } else {
      window.history.pushState({}, "", `/map`);
    }

    this.showActiveClub();
  };

  showActiveClub = () => {
    const containerEl = document.getElementById("club-detail");
    const activeClubEl = document.getElementById("active-club-info");
    const activeClubId = location.pathname.split("/")[2];
    const activeClub = this.mappableClubs.find((c) => c.id === activeClubId);

    if (activeClub) {
      containerEl.dataset.isOpen = "true";
      const alreadyActiveId = activeClubEl.dataset.id === activeClubId;

      if (!alreadyActiveId) {
        activeClubEl.dataset.id = activeClubId;
        const html = clubInfoTemplate({ club: activeClub });
        activeClubEl.innerHTML = html;
      }
    } else {
      containerEl.dataset.isOpen = "false";
    }

    const markers = Array.from(document.getElementsByClassName("marker"));
    markers.forEach((m: HTMLDivElement) => {
      const isActive = m.dataset.id === activeClubId;
      m.dataset.isActive = String(isActive);
    });
  };
}
