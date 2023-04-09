import { Club } from "../types";

export const getStars = (club: any) => {
  let stars = 0;
  if (club.distinction === "★") stars = 1;
  if (club.distinction === "★★") stars = 2;
  if (club.distinction === "★★★") stars = 3;
  return stars;
};

export const getCountryClubsHTML = (country: string, clubs: Club[]) => {
  const countryEl = document.createElement("div");
  countryEl.classList.add("country");
  let countryHTML = `<h4 data-type="title-s">${country}</h4>`;
  const clubsByRegion: Record<string, Club[]> = {};

  clubs.forEach((club) => {
    const region = club.region || "";
    clubsByRegion[region] = clubsByRegion[region] || [];
    clubsByRegion[region].push(club);
  });

  Object.entries(clubsByRegion).forEach(([region, clubs]) => {
    const regionEl = document.createElement("div");
    regionEl.classList.add("region");
    countryEl.appendChild(regionEl);
    const clubsByMetro: Record<string, Club[]> = {};

    clubs.forEach((club) => {
      clubsByMetro[club.metro] = clubsByMetro[club.metro] || [];
      clubsByMetro[club.metro].push(club);
    });

    Object.entries(clubsByMetro).forEach(([metro, clubs]) => {
      const metroEl = document.createElement("div");
      metroEl.classList.add("metro");
      countryHTML += `<label data-type="label-s">${
        region ? `${region} • ` : ""
      }${metro}</label>`;
      regionEl.appendChild(metroEl);

      clubs.forEach((c) => {
        countryHTML += `<div class="club" data-id="${c.id}" data-type="body-s">
          ${c.name}
          <span>→</span>
        </div>`;
      });
    });
  });

  return countryHTML;
};
