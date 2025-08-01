import { Reservation } from "../model/tour.model.js";

function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        return response.text().then(text => {
            throw new Error(text || `Request failed. Status: ${response.status}`);
        });
    }
    return response.json();
}

export class ReservationService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "http://localhost:48696/api/reservations";
    }

    getByTourId(tourId: number): Promise<Reservation[]> {
        const url = `${this.apiUrl}?tourId=${tourId}`;
        return fetch(url)
        .then(response => handleResponse<Reservation[]>(response))
        .then(res => res)
        .catch(error => {
            console.error("Error fetching reservation by tour ID:", error.message);
            throw error;
        });
    }

    getByUserId(userId: number): Promise<Reservation[]> {
        const url = `${this.apiUrl}?userId=${userId}`;
        return fetch(url)
        .then(response => handleResponse<Reservation[]>(response))
        .then(res => res)
        .catch(error => {
            console.error("Error fetching reservation by user ID:", error.message);
            throw error;
        });
    }

    createReservation(reservation: Reservation): Promise<Reservation> {
        return fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reservation)
        })
        .then(response => handleResponse<Reservation>(response))
        .then(reservation => {
            console.log("Successfully created reservation:", reservation);
            return reservation;
        })
        .catch(error => {
            console.error("Error creating reservation:", error.message);
            throw error;
        });
    }

    deleteReservation(reservationId: number): Promise<void> {
        const url = `${this.apiUrl}/${reservationId}`;

        return fetch(url,{
            method:"DELETE"
        })
        .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || `Failed to delete reservation. Status: ${response.status}`);
            });
        }
        console.log("Reservation deleted successfully.");
    })}
}