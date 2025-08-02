import { Reservation, Tour } from "../../../model/tour.model.js";
import { ReservationService } from "../../../service/reservation.service.js";
import { TourService } from "../../../service/tour.service.js";

const resSer = new ReservationService();
const tourSer = new TourService();
const userId = Number(localStorage.getItem("userId"));

function loadReservations(): void {
    Promise.all([
        resSer.getByUserId(userId),
        tourSer.getAll()
    ])
    .then(([reservations, tours]) => {
        deletePastReservations(reservations, tours.data)
            .then(() => {
                resSer.getByUserId(userId)
                    .then(updatedReservations => {
                        renderReservation(updatedReservations, tours.data);
                    });
            });
    })
    .catch(error => {
        console.error("Error while loading reservations:", error.message);
    });
}

function renderReservation(reservations: Reservation[], tours: Tour[]) {
    generateReservationCard(reservations, tours);
    attachCancelListener();  
}

function generateReservationCard(reservations: Reservation[], tours: Tour[]) {
    const container = document.querySelector(".reservations");

    if (reservations.length === 0) {
        container.innerHTML = `<p>You don't have any reservations made.</p>`;
        return;
    }

    container.innerHTML = ""; 

    reservations.forEach(res => {
        const tour = tours.find(t => t.id === res.tourId);

        if (!tour) return;

        const card = document.createElement("div");
        card.className = "reservation-card";

        card.innerHTML = `
        <div class='top-card'>
            <h3>${tour.name}</h3>
            <p id='date'>${new Date(tour.dateTime).toLocaleString("sr-RS", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"})}
            </p>
        </div>   
            <p id='numOfPeople'>Reserved for: ${res.numberOfPeople}</p>
            <button class="cancelBtn" data-id=${res.id}>Cancel</button>
        `;

        container.appendChild(card);
    });
}

function attachCancelListener() {
    const cancelBtn = document.querySelectorAll(".cancelBtn");
    cancelBtn.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLElement).getAttribute("data-id"));
            const confirmed = confirm("Are you sure you want to cancel this reservation?");
            if(confirmed){
                resSer.deleteReservation(id)
                .then(() => {
                    loadReservations();
                })
                .catch(error => {
                    alert("Error deleting reservation: " + error.message);
                });
            }
        })
    })
}

function deletePastReservations(reservations: Reservation[], tours: Tour[]): Promise<void[]> {
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const deletions = reservations
        .filter(res => {
            const tour = tours.find(t => t.id === res.tourId);
            if (!tour || !tour.dateTime) return false;

            const tourDate = new Date(tour.dateTime);
            const tourEndTime = new Date(tourDate.getTime() + oneDayMs);

            return now > tourEndTime;
        })
        .map(res => {
            return resSer.deleteReservation(res.id).catch(err => {
                console.warn(`Unable to delete reservation with ID ${res.id}: ${err.message}`);
            });
        });

    return Promise.all(deletions);
}

loadReservations();


