import { Restaurant } from "../models/restaurant.model";

const API_URL = "http://localhost:5105/api/restaurants";

export class RestaurantService {
  createRestaurant(restaurant: Restaurant): Promise<Restaurant> {
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurant),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Greska prilikom kreiranja restorana.");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Greska u createRestaurant:", error);
        throw error;
      });
  }
  getByOwner(ownerId: number): Promise<Restaurant[]> {
    console.log("Pozivam API sa ownerId:", ownerId);

    return fetch(`${API_URL}?ownerId=${ownerId}`)
      .then((response) => {
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Greska prilikom dobavljanja restorana.");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Greska u getMyRestaurants:", error);
        throw error;
      });
  }
  updateRestaurant(restaurant: Restaurant): Promise<Restaurant> {
    console.log("Saljem update za restoran:", restaurant);
    return fetch(`${API_URL}/${restaurant.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurant),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Greska prilikom izmene restorana.");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Greska u updateRestaurant:", error);
        throw error;
      });
  }
  deleteRestaurant(id: number): Promise<void> {
    return fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Greska prilikom brisanja restorana.");
        }
      })
      .catch((error) => {
        console.error("Greska u deleteRestaurant:", error);
        throw error;
      });
  }

  getById(id: number): Promise<Restaurant> {
    return fetch(`${API_URL}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Greska prilikom dobavljanja restorana.");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Greska u getById:", error);
        throw error;
      });
  }
}
