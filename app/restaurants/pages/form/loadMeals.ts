import { Meal } from "../../models/meal.model.js";
import { MealService } from "../../services/meal.service.js";

const mealService = new MealService();

function renderMeals(meals: Meal[]) {
  const mealsList = document.getElementById("mealsList")!;
  mealsList.innerHTML = "";

  meals.forEach((meal) => {
    const mealDiv = document.createElement("div");
    mealDiv.className = "meal-item";
    mealDiv.innerHTML = `
      <span>${meal.name} - ${meal.price} RSD</span>
      <button data-id="${meal.id}">Obriši</button>
    `;
    mealsList.appendChild(mealDiv);

    const deleteBtn = mealDiv.querySelector("button")!;
    deleteBtn.addEventListener("click", () => {
      mealService
        .delete(meal.restaurantId, meal.id)
        .then(() => {
          alert("Jelo obrisano.");
          loadMeals(meal.restaurantId);
        })
        .catch(() => alert("Greska prilikom brisanja jela."));
    });
  });
}
export function loadMeals(restaurantId: number) {
  mealService
    .getByRestaurant(restaurantId)
    .then(renderMeals)
    .catch(() => alert("Greska prilikom učitavanja jela."));
}
export function setupAddMeal(restaurantId: number) {
  const addMealBtn = document.getElementById("addMealBtn")!;
  const formContainer = document.getElementById("mealFormContainer")!;
  const saveMealBtn = document.getElementById("saveMealBtn")!;

  addMealBtn.addEventListener("click", () => {
    formContainer.style.display = "flex";
  });

  saveMealBtn.addEventListener("click", () => {
    const name = (document.getElementById("mealName") as HTMLInputElement)
      .value;
    const price = parseFloat(
      (document.getElementById("mealPrice") as HTMLInputElement).value
    );
    const ingredients = (
      document.getElementById("mealIngredients") as HTMLInputElement
    ).value;
    const imageUrl = (
      document.getElementById("mealImageUrl") as HTMLInputElement
    ).value;

    if (!name.trim() || isNaN(price) || price <= 0 || !ingredients.trim()) {
      alert("Ime, sastojci i cena su obavezni. Cena mora biti pozitivan broj.");
      return;
    }

    const newMeal: Meal = {
      id: 0,
      name,
      price,
      ingredients,
      imageUrl,
      restaurantId,
    };

    mealService
      .create(restaurantId, newMeal)
      .then(() => {
        alert("Jelo dodato.");
        formContainer.style.display = "none";
        loadMeals(restaurantId);
      })
      .catch(() => alert("Greska prilikom dodavanja jela."));
  });
}
