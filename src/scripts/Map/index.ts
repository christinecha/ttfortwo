import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// import { getGeocode, getLatLng } from "use-places-autocomplete";
// import { getDistance } from "geolib";
import clubsById from "../../../generated/clubs.json";
import { addClubPreview } from "./util";

// const MOBILE_VIEW = {
//   LIST: { name: "List" },
//   MAP: { name: "Map" },
// };

const getMarkerImage = (club: any, width: number) => {
  let stars = 0;
  if (club.distinction === "★") stars = 1;
  if (club.distinction === "★★") stars = 2;
  if (club.distinction === "★★★") stars = 3;

  const markerImg = document.createElement("img");
  markerImg.width = width;
  markerImg.src = stars ? `/assets/marker-${stars}.png` : "/assets/marker.png";

  return markerImg;
};

enum VIEW {
  MAP,
  LIST,
}

type onMapToolsChange = (props: { view: VIEW }) => void;

export class MapTools {
  mapTools: HTMLElement;
  mapViewButton: HTMLButtonElement;
  listViewButton: HTMLButtonElement;
  view: VIEW;
  onChange: onMapToolsChange;

  constructor({ onChange }: { onChange: onMapToolsChange }) {
    this.onChange = onChange;
    this.mapTools = document.querySelector(".map-tools") as HTMLDivElement;
    this.mapViewButton = this.mapTools.querySelector(
      ".map-view-button"
    ) as HTMLButtonElement;
    this.listViewButton = this.mapTools.querySelector(
      ".list-view-button"
    ) as HTMLButtonElement;

    this.view = VIEW.MAP;

    this.mapViewButton.addEventListener("click", () => {
      this.view = VIEW.MAP;
      this.onChange({ view: this.view });
    });

    this.listViewButton.addEventListener("click", () => {
      this.view = VIEW.LIST;
      this.onChange({ view: this.view });
    });
  }
}

export class Map {
  map: HTMLDivElement;
  list: HTMLDivElement;
  mapTools: MapTools;
  clubEls: HTMLUListElement[];

  constructor() {
    this.map = document.querySelector("section.map") as HTMLDivElement;
    this.list = document.querySelector("section.list") as HTMLDivElement;
    this.mapTools = new MapTools({
      onChange: ({ view }) => {
        this.map.dataset.isActive = String(view === VIEW.MAP);
        this.list.dataset.isActive = String(view === VIEW.LIST);
      },
    });
    this.initializeMapView();
  }

  initializeMapView = () => {
    const clubs = Object.values(clubsById) as any[];

    mapboxgl.accessToken =
      "pk.eyJ1IjoiY2hyaXN0aW5lY2hhIiwiYSI6ImNsY3RxeGtmYTEyYTk0MW12ajF4ZXNlY2UifQ.gez3i-T5-jNbaGf98SjogA";

    const mappableClubs = clubs.filter((club) => {
      const { lat, lng } = club as any;
      return lat && lng;
    });
    const rand = Math.floor(Math.random() * mappableClubs.length);
    const randomClub = mappableClubs[rand];

    const map = new mapboxgl.Map({
      container: "mapbox-container", // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [randomClub.lng, randomClub.lat], // starting position [lng, lat]
      zoom: 0.8, // starting zoom
    });

    mappableClubs.forEach((club) => {
      const { lat, lng } = club as any;
      const clubLngLat = new mapboxgl.LngLat(parseFloat(lng), parseFloat(lat));

      const element = document.createElement("div");
      element.classList.add("marker");
      const markerImg = getMarkerImage(club, 36);
      element.appendChild(markerImg);

      element.addEventListener("click", () => {
        addClubPreview(club, this.map);
        Array.from(document.querySelectorAll(".marker")).forEach((m) => {
          (m as HTMLDivElement).dataset.isActive = String(m === element);
        });
      });

      // Create a new marker.
      const marker = new mapboxgl.Marker({
        element,
        anchor: "bottom",
      })
        .setLngLat(clubLngLat)
        .addTo(map);
    });
  };

  initializeListView = () => {
    const clubEls = Array.from(
      document.getElementsByClassName("club")
    ) as HTMLUListElement[];
    const clubs = Object.values(clubsById) as any[];

    clubs.forEach((club) => {
      const clubEl = clubEls.find((el) => el.dataset.slug === club.slug);
      if (clubEl) {
        const listImg = getMarkerImage(club, 24);
        clubEl.prepend(listImg);
        // clubEl.addEventListener("click", () => {
        //   map.setCenter(clubLngLat);
        // });
      }
    });
  };
}
