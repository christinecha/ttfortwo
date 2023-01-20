export const addClubPreview = (club: any, container: HTMLDivElement) => {
  let el = document.querySelector(
    `.club-preview[data-slug="${club.slug}"]`
  ) as HTMLDivElement;

  if (!el) {
    el = document.createElement("div");
    el.classList.add("club-preview");
    el.dataset.slug = club.slug;

    const strong = document.createElement("strong");
    strong.textContent = club.name;

    const p = document.createElement("p");
    p.textContent = club.address;

    const close = document.createElement("button");
    close.textContent = "X";
    close.addEventListener("click", () => {
      container.removeChild(el);
    });

    el.appendChild(close);
    el.appendChild(strong);
    el.appendChild(p);

    const width = 300;
    el.style.width = `${width}px`;
    const randTop = Math.floor(
      Math.random() * (container.clientHeight - el.clientHeight - 40)
    );
    el.style.top = `${randTop}px`;
    el.dataset.side = Math.random() < 0.5 ? "left" : "right";

    container.appendChild(el);
  }

  Array.from(container.querySelectorAll(".club-preview")).forEach((e) => {
    (e as HTMLDivElement).dataset.isActive = String(e === el);
  });
};
