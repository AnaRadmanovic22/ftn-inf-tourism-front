import { RestaurantService } from "../../services/restaurant.service.js";
import { Restaurant } from "../../models/restaurant.model";

const sortDropdown = document.getElementById(
  "sortDropdown"
) as HTMLSelectElement;
const orderDropdown = document.getElementById(
  "orderDropdown"
) as HTMLSelectElement;
const pageSizeDropdown = document.getElementById(
  "pageSize"
) as HTMLSelectElement;
const prevPageBtn = document.getElementById("prevPage") as HTMLButtonElement;
const nextPageBtn = document.getElementById("nextPage") as HTMLButtonElement;
const container = document.getElementById(
  "restaurantContainer"
) as HTMLDivElement;

const service = new RestaurantService();

let currentPage = 1;
let totalPages = 1;
let pageSize = parseInt(pageSizeDropdown.value);

sortDropdown.addEventListener("change", () => renderData());
orderDropdown.addEventListener("change", () => renderData());
pageSizeDropdown.addEventListener("change", () => {
  pageSize = parseInt(pageSizeDropdown.value);
  currentPage = 1;
  renderData();
});
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderData();
  }
});
nextPageBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderData();
  }
});

function renderData(): void {
  const orderBy = sortDropdown.value;
  const orderDirection = orderDropdown.value;

  service
    .getPaged(currentPage, pageSize, orderBy, orderDirection)
    .then((response) => {
      console.log("Odgovor sa servera:", response);
      displayRestaurants(response.data);
      totalPages = Math.ceil(response.totalCount / pageSize);
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
    })
    .catch((err) => {
      console.error("Greska u preuzimanju restorana:", err);
    });
}

function displayRestaurants(restaurants: Restaurant[]): void {
  container.innerHTML = "";

  restaurants.forEach((r) => {
    const card = document.createElement("div");
    card.classList.add("restaurant-card");
    card.innerHTML = `
      <h3>${r.name}</h3>
      <p>${r.description}</p>
      <p>Kapacitet: ${r.capacity}</p>
        <a href="../restaurantDetails/restaurantDetails.html?id=${r.id}" class="details-link">Detalji</a>    `;
    container.appendChild(card);
  });
}

renderData();
