import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// import { getGeocode, getLatLng } from "use-places-autocomplete";
// import { getDistance } from "geolib";
import clubsById from "../../generated/clubs.json";

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

export class Map {
  clubEls: HTMLUListElement[];

  constructor() {
    const clubEls = Array.from(
      document.getElementsByClassName("club")
    ) as HTMLUListElement[];
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
      zoom: 9, // starting zoom
    });

    mappableClubs.forEach((club) => {
      const { lat, lng } = club as any;
      const clubLngLat = new mapboxgl.LngLat(parseFloat(lng), parseFloat(lat));

      const element = document.createElement("div");
      const markerImg = getMarkerImage(club, 40);
      element.appendChild(markerImg);

      // Create a new marker.
      const marker = new mapboxgl.Marker({
        element,
      })
        .setLngLat(clubLngLat)
        .addTo(map);

      const clubEl = clubEls.find((el) => el.dataset.slug === club.slug);
      if (clubEl) {
        const listImg = getMarkerImage(club, 24);
        clubEl.prepend(listImg);
        clubEl.addEventListener("click", () => {
          map.setCenter(clubLngLat);
        });
      }
    });
  }
}
