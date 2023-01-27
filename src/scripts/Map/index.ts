import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// import { getGeocode, getLatLng } from "use-places-autocomplete";
// import { getDistance } from "geolib";
import clubsById from "../../../generated/clubs.json";
import { addClubPreview, getMarkerElement, getStars } from "./util";

// const MOBILE_VIEW = {
//   LIST: { name: "List" },
//   MAP: { name: "Map" },
// };

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

export class MapTools {
  mapTools: HTMLElement;
  mapViewButton: HTMLButtonElement;
  listViewButton: HTMLButtonElement;
  view: VIEW;
  onChange: onMapToolsChange;
  starFilter: HTMLDivElement;
  badgeFilter: HTMLDivElement;
  starOptions: Record<string, boolean>;
  filteredClubs: any[];

  constructor({ onChange }: { onChange: onMapToolsChange }) {
    this.onChange = onChange;
    this.mapTools = document.querySelector(".map-tools") as HTMLDivElement;

    this.starFilter = this.mapTools.querySelector(".filter.star");
    this.badgeFilter = this.mapTools.querySelector(".filter.badge");

    const clubsByStar: Record<string, any[]> = {};
    const clubsByBadge: Record<string, any[]> = {};

    const allClubs = Object.values(clubsById);
    this.filteredClubs = allClubs;

    this.filteredClubs.forEach((club) => {
      const stars = getStars(club);
      clubsByStar[stars] = clubsByStar[stars] || [];
      clubsByStar[stars].push(club);

      const tags = [...club.type];

      tags.forEach((tag) => {
        clubsByBadge[tag] = clubsByBadge[tag] || [];
        clubsByBadge[tag].push(club);
      });
    });

    this.starOptions = {};
    Object.keys(clubsByStar).forEach((key) => {
      this.starOptions[key] = true;
    });

    const getFilteredClubs = () => {
      let filtered: any[] = [];
      Object.keys(this.starOptions).forEach((key) => {
        if (this.starOptions[key]) {
          filtered = filtered.concat(clubsByStar[key]);
        }
      });
      return filtered;
    };

    const starOptionEls = Array.from(
      this.starFilter.querySelectorAll(".filter-option")
    ) as HTMLDivElement[];

    starOptionEls.forEach((el) => {
      el.addEventListener("click", () => {
        const key = el.dataset.stars as string;
        this.starOptions[key] = !this.starOptions[key];
        el.dataset.isActive = String(this.starOptions[key]);
        this.filteredClubs = getFilteredClubs();
        this.hasChanged();
      });
    });

    // this.badgeOptions = {};
    // Object.keys(clubsByStar).forEach((key) => {
    //   this.starOptions[key] = true;
    // });

    // const optionList = document.createElement("div");
    // optionList.classList.add("options");
    // uniqueOptions.forEach((option) => {
    //   const optionEl = document.createElement("div");
    //   optionEl.classList.add("option");
    //   optionEl.innerHTML = `<span className="check"></span>${option}`;
    //   optionList.appendChild(optionEl);
    // });
    // el.appendChild(optionList);

    // el.addEventListener("click", () => {
    //   this.mapTools.dataset.openFilter = property;
    // });

    // return {
    //   property,
    //   el,
    //   options: uniqueOptions,
    // };

    // this.mapViewButton.addEventListener("click", () => {
    //   this.onChange({ view: this.view });
    // });

    // this.listViewButton.addEventListener("click", () => {
    //   this.onChange({ view: this.view });
    // });
  }

  hasChanged = () => {
    this.onChange({
      filteredClubs: this.filteredClubs,
    });
  };
}

export class Map {
  map: HTMLDivElement;
  mapTools: MapTools;
  clubEls: HTMLUListElement[];

  constructor() {
    this.map = document.querySelector("section.map") as HTMLDivElement;
    this.mapTools = new MapTools({
      onChange: ({ filteredClubs }) => {
        Object.values(clubsById).forEach((club: any) => {
          const clubMarker = this.map.querySelector(
            `.marker[data-club-id="${club.id}"]`
          ) as HTMLDivElement;
          if (clubMarker) {
            clubMarker.dataset.isHidden = String(
              !filteredClubs.some((c) => c.id === club.id)
            );
          }
        });
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

    const zoom = window.innerWidth > 1000 ? 0.8 : 0.6;

    const map = new mapboxgl.Map({
      container: "mapbox-container", // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-73.7893326442353, 41.1326998386741], // wttc
      zoom, // starting zoom
    });

    mappableClubs.forEach((club) => {
      const { lat, lng } = club as any;
      const clubLngLat = new mapboxgl.LngLat(parseFloat(lng), parseFloat(lat));
      const markerEl = getMarkerElement(club);

      markerEl.addEventListener("click", () => {
        addClubPreview(club, this.map);
        Array.from(document.querySelectorAll(".marker")).forEach((m) => {
          (m as HTMLDivElement).dataset.isActive = String(m === markerEl);
        });
      });

      // Create a new marker.
      const marker = new mapboxgl.Marker({
        element: markerEl,
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
      const clubEl = clubEls.find((el) => el.dataset.id === club.id);
      if (clubEl) {
        const listImg = getMarkerElement(club);
        clubEl.prepend(listImg);
        // clubEl.addEventListener("click", () => {
        //   map.setCenter(clubLngLat);
        // });
      }
    });
  };
}
