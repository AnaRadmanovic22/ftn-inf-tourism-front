import { RestaurantService } from "../../services/restaurant.service.js";
import { Restaurant } from "../../models/restaurant.model";
import { reservationHandler } from "../../reservations/reservationForm.js";

const service = new RestaurantService();

const container = document.getElementById(
  "restaurantDetailsContainer"
) as HTMLDivElement;

const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get("id") || "0");

if (id && id > 0) {
  service
    .getById(id)
    .then((restaurant: Restaurant) => {
      displayRestaurantDetails(restaurant);
      reservationHandler(restaurant.id);
    })
    .catch((error) => {
      console.error("Greska pri dohvatanju restorana:", error);
      container.innerHTML = "<p>Greska pri dohvatanju detalja restorana.</p>";
    });
} else {
  container.innerHTML = "<p>Nevalidan ID restorana.</p>";
}

function displayRestaurantDetails(restaurant: Restaurant): void {
  const infoDiv = document.getElementById("restaurantInfo") as HTMLDivElement;
  infoDiv.innerHTML = `
    <h2>${restaurant.name}</h2>
    <p>${restaurant.description}</p>
    <p><strong>Kapacitet:</strong> ${restaurant.capacity}</p>
    <img src="${
      restaurant.imageUrl
    }" alt="Slika restorana" style="max-width: 400px; border-radius: 8px;" />
    <h3>Jelovnik:</h3>
    <ul>
      ${
        restaurant.meals && restaurant.meals.length > 0
          ? restaurant.meals
              .map((meal) => `<li>${meal.name} - ${meal.price} RSD</li>`)
              .join("")
          : "<p>Jelovnik nije dostupan.</p>"
      }
    </ul>
  `;
}
