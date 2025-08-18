import { Restaurant } from "../../models/restaurant.model";
import { RestaurantService } from "../../services/restaurant.service.js";
import { checkLoginStatus, handleLogout } from "../../../users/service/auth.js";
import { loadMeals, setupAddMeal } from "./loadMeals.js";
import {
  populateFormFields,
  getRestaurantIdFromUrl,
  buildRestaurantFromForm,
} from "../../utils/formUtils.js";
import { MealService } from "../../services/meal.service.js";

const restaurantService = new RestaurantService();
const form = document.getElementById("restaurantForm") as HTMLFormElement;
function validateRestaurantForm(): boolean {
  const name = (
    document.getElementById("name") as HTMLInputElement
  ).value.trim();
  const description = (
    document.getElementById("description") as HTMLTextAreaElement
  ).value.trim();
  const capacity = (document.getElementById("capacity") as HTMLInputElement)
    .value;
  const latitude = (document.getElementById("latitude") as HTMLInputElement)
    .value;
  const longitude = (document.getElementById("longitude") as HTMLInputElement)
    .value;

  if (!name || !description || !capacity || !latitude || !longitude) {
    alert("Sva polja osim slike su obavezna.");
    return false;
  }

  if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
    alert("Kapacitet mora biti pozitivan broj.");
    return false;
  }

  if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
    alert("Geografske koordinate moraju biti brojevi.");
    return false;
  }

  return true;
}

function loadRestaurant(id: number): void {
  restaurantService
    .getById(id)
    .then((restaurant: Restaurant) => {
      populateFormFields(restaurant);
      loadMeals(id);
      setupAddMeal(id);
    })
    .catch((error) => {
      console.error("Greska prilikom dobavljanja restorana:", error);
      alert("Neuspesno dobavljanje podataka restorana.");
    });
}

function handleFormSubmit(e: Event): void {
  e.preventDefault();
  console.log("Kliknuto je sačuvaj");
  if (!validateRestaurantForm()) return;

  const id = getRestaurantIdFromUrl();
  const restaurant = buildRestaurantFromForm(id);

  if (id) {
    restaurantService
      .update(restaurant)
      .then(() => {
        alert("Restoran uspesno izmenjen!");
        window.location.href = "../list/myRestaurant.html";
      })
      .catch((error) => {
        alert("Greska prilikom izmene restorana: " + error.message);
      });
  } else {
    restaurant.status = "u pripremi";
    restaurantService
      .create(restaurant)
      .then(() => {
        alert("Restoran uspesno dodat!");
        window.location.href = "../list/myRestaurant.html";
      })
      .catch((error) => {
        alert("Greska prilikom dodavanja restorana: " + error.message);
      });
  }
}

function handlePublish(id: number): void {
  const mealService = new MealService();

  restaurantService
    .getById(id)
    .then((restaurant: Restaurant) => {
      if (!restaurant.imageUrl || restaurant.imageUrl.trim() === "") {
        alert("Restoran mora imati barem jednu sliku enterijera pre objave.");
        return;
      }

      return mealService.getByRestaurant(id).then((meals) => {
        if (meals.length < 5) {
          alert("Restoran mora imati najmanje 5 jela pre objave.");
          return;
        }

        const updatedRestaurant = {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          capacity: restaurant.capacity,
          imageUrl: restaurant.imageUrl,
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          ownerId: restaurant.ownerId,
          status: "objavljen",
          meals: meals,
        };

        console.log("Šaljem ovaj restoran za update:", updatedRestaurant);

        return restaurantService.update(updatedRestaurant).then((res) => {
          console.log(" Backend vratio nakon update:", res);
          alert("Restoran je uspesno objavljen!");
          window.location.href = "../list/myRestaurant.html";
        });
      });
    })
    .catch((error) => {
      console.error("Greska prilikom objave:", error);
      alert("Greska prilikom objave restorana.");
    });
}

function setupNavbar(): void {
  checkLoginStatus();

  const logoutElement = document.querySelector("#logout");
  if (logoutElement) {
    logoutElement.addEventListener("click", handleLogout);
  }

  const username = localStorage.getItem("username");
  if (!username) {
    alert("Morate biti ulogovani da biste dodali restoran.");
    window.location.href = "../../../index.html";
  }
}

function init(): void {
  console.log("Pokrećem init");
  setupNavbar();
  const id = getRestaurantIdFromUrl();
  console.log("ID iz URL-a je:", id);
  if (id) {
    loadRestaurant(id);
    const publishBtn = document.getElementById(
      "publishBtn"
    ) as HTMLButtonElement;

    if (publishBtn) {
      publishBtn.style.display = "inline-block";

      publishBtn.addEventListener("click", () => handlePublish(id));
    } else {
      publishBtn.style.display = "none";
    }
  }
  form.addEventListener("submit", handleFormSubmit);
}
init();
