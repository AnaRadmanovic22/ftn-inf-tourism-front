import { Meal } from "./meal.model";

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  status?: string;
  ownerId: number;
  meals?: Meal[];
}
export interface RestaurantPagedResult {
  data: Restaurant[];
  totalCount: number;
=======
}
