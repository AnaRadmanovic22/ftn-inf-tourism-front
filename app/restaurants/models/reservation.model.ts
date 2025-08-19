export type MealType = "Breakfast" | "Lunch" | "Dinner";

export interface Reservation {
  id: number;
  restaurantId: number;
  touristId: number;
  date: string; // string npr. "2025-08-01"
  mealType: MealType;
  numberOfGuests: number;
}
