export const getMarkerElement = (club: any) => {
  const element = document.createElement("div");
  element.classList.add("marker");

  const starsEl = document.createElement("div");
  starsEl.classList.add("stars");
  element.appendChild(starsEl);

  let stars = 0;
  if (club.distinction === "★") stars = 1;
  if (club.distinction === "★★") stars = 2;
  if (club.distinction === "★★★") stars = 3;

  element.dataset.stars = String(stars);

  return element;
};

enum SIDE {
  LEFT = "left",
  RIGHT = "right",
}
let lastSide: SIDE = SIDE.LEFT;
export const addClubPreview = (club: any, container: HTMLDivElement) => {
  let el = document.querySelector(
    `.club-preview[data-slug="${club.slug}"]`
  ) as HTMLDivElement;

  if (!el) {
    el = document.createElement("div");
    el.classList.add("club-preview");
    el.dataset.slug = club.slug;

    const badges = document.createElement("div");
    badges.classList.add("badges");
    el.appendChild(badges);
    (club.type || []).forEach((type: string) => {
      let src;
      if (type === "Private") src = "/assets/badge-private.png";
      if (type === "Public") src = "/assets/badge-public.png";
      if (type === "Permanent") src = "/assets/badge-permanent.png";
      if (type === "Transient") src = "/assets/badge-transient.png";
      if (type === "Bar/Restaurant") src = "/assets/badge-bar-restaurant.png";
      if (type === "Just a Table") src = "/assets/badge-table.png";
      if (src) {
        const badge = document.createElement("div");
        badge.classList.add("badge");
        const img = document.createElement("img");
        img.src = src;
        badge.appendChild(img);
        badges.appendChild(badge);
      }
    });

    const content = document.createElement("div");
    content.classList.add("content");
    el.appendChild(content);

    const marker = getMarkerElement(club);
    content.appendChild(marker);

    const inner = document.createElement("div");
    inner.classList.add("inner");
    inner.innerHTML = `
      <a href="${club.url}" target="_blank"><strong>${
      club.name
    }</strong></a><br />
      <p>${club.address || ""}</p>
    `;
    content.appendChild(inner);

    const close = document.createElement("button");
    close.textContent = "X";
    close.addEventListener("click", () => {
      container.removeChild(el);
    });

    const width = 300;
    el.style.width = `${width}px`;
    const randTop = Math.floor(Math.random() * (container.clientHeight - 200));
    el.style.top = `${randTop}px`;

    lastSide = lastSide === SIDE.LEFT ? SIDE.RIGHT : SIDE.LEFT;
    el.dataset.side = String(lastSide);

    container.appendChild(el);
  }

  Array.from(container.querySelectorAll(".club-preview")).forEach((e) => {
    (e as HTMLDivElement).dataset.isActive = String(e === el);
  });
};
