export type MealType = "Breakfast" | "Lunch" | "Dinner";

export interface ReservationDto {
  id: number;
  restaurantId: number;
  tourstId: number;
  date: string; //"YYYY-MM-DD"
  mealType: MealType;
  numberOfGuests: number;
}

export class ReservationService {
  private baseUrl = "http://localhost:5105/api/restaurants";

  getByTourist(touristId: number): Promise<ReservationDto[]> {
    return fetch(`${this.baseUrl}/reservations?touristId=${touristId}`).then(
      (r) => {
        if (!r.ok) throw new Error("Ne mogu da dobijem rezervacije.");
        return r.json();
      }
    );
  }
  cancel(reservationId: number): Promise<{ message?: string }> {
    return fetch(`${this.baseUrl}/reservations/${reservationId}`, {
      method: "DELETE",
    }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        //vrati poruku sa backenda ako postoji
        throw new Error(data?.message ?? "Otkazivanje nije dozvoljeno");
      }
      return data;
    });
  }
}
