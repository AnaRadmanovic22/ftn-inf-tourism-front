import {
  ReservationService,
  ReservationDto,
} from "../../reservations/service/reservation.service.js";

import { handleLogout } from "../../../users/service/auth.js";

const svc = new ReservationService();
const list = document.getElementById("myReservations") as HTMLDivElement;
const msg = document.getElementById("resMsg") as HTMLDivElement;
const userId = Number(localStorage.getItem("currentTouristId") || "1");
const statCount = document.getElementById("statCount") as HTMLSpanElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchBtn = document.getElementById(
  "searchBtn"
) as HTMLButtonElement | null;
const resetBtn = document.getElementById(
  "resetBtn"
) as HTMLButtonElement | null;

let cache: ReservationDto[] = [];

function showMsg(text: string, color: "red" | "green") {
  msg.textContent = text;
  msg.style.color = color;
  setTimeout(() => {
    msg.textContent = "";
  }, 3000);
}

function formatMeal(m: string) {
  switch (m) {
    case "Breakfast":
      return "Dorucak (08:00)";
    case "Lunch":
      return "Rucak (13:00)";
    case "Dinner":
      return "Vecera (18:00)";
    default:
      return m;
  }
}

function render(items: ReservationDto[]) {
  cache = items;
  if (statCount) statCount.textContent = String(items.length);

  if (!items.length) {
    list.innerHTML = `<p>Nemate rezervacije.</p>`;
    return;
  }
  list.innerHTML = items
    .map(
      (r) => `
    <div class="reservation-card" data-id="${r.id}">
      <div class="row">
        <div><b>Restoran ID:</b> ${r.restaurantId}</div>
        <div><b>Datum:</b> ${r.date}</div>
        <div><b>Obrok:</b> ${formatMeal(r.mealType)}</div>
        <div><b>Broj osoba:</b> ${r.numberOfGuests}</div>
      </div>
      <div class="actions">
        <button class="btn-cancel" data-id="${r.id}">Otkazi</button>
      </div>
    </div>
  `
    )
    .join("");

  // povezivanje dugmadi za otkazivanje
  list.querySelectorAll<HTMLButtonElement>(".btn-cancel").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (!confirm("Da li ste sigurni da zelite da otkazete rezervaciju?"))
        return;

      svc
        .cancel(id)
        .then((data) => {
          showMsg(data?.message ?? "Rezervacija je otkazana.", "green");
          const card = list.querySelector<HTMLElement>(
            `.reservation-card[data-id="${id}"]`
          );
          if (card) card.remove();
          if (!list.children.length)
            list.innerHTML = `<p>Nemate rezervacije.</p>`;
        })
        .catch((err: Error) => {
          showMsg(err.message, "red");
        });
    });
  });
}
// vrlo prost filter
function applyFilter() {
  if (!searchInput) return;
  const q = searchInput.value.trim().toLowerCase();
  const filtered = !q
    ? cache
    : cache.filter(
        (r) =>
          r.date.toLowerCase().includes(q) ||
          r.mealType.toLowerCase().includes(q)
      );
  render(filtered);
}

if (searchBtn) searchBtn.addEventListener("click", applyFilter);
if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyFilter();
  });
}
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    render(cache);
  });
}

function load() {
  svc
    .getByTourist(userId)
    .then(render)
    .catch(() => showMsg("Neuspesno dohvatanje rezervacija.", "red"));
}

load();

const logoutElement = document.querySelector("#logout");
if (logoutElement) {
  logoutElement.addEventListener("click", (e) => {
    e.preventDefault();
    handleLogout();
  });
}
