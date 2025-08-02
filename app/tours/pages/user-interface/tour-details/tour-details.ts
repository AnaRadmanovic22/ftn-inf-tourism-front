import { Tour } from "../../../model/tour.model.js";
import { TourService } from "../../../service/tour.service.js";
import { ReservationService } from "../../../service/reservation.service.js";
const resService = new ReservationService();
const tourService = new TourService();
const imageUrl = "https://unbredbombers.ca/wp-content/uploads/2018/05/no-image-1.jpg";

const parms = new URLSearchParams(window.location.search);
const tourId = Number(parms.get("id"));
const userId = Number(localStorage.getItem("userId"));

function loadTour(): void {
    tourService.getById(tourId)
    .then(tour => {
       renderTour(tour);
    })
    .catch(error => {
            console.error("Error:", error);
            alert("Error occurred while loading tour.");
    });
}

function loadAvailableSpots(tour: Tour): void {
    resService.getByTourId(tour.id)
        .then(reservations => {
            const occupied = reservations.reduce((sum, r) => sum + r.numberOfPeople, 0);
            const available = tour.maxGuests - occupied;

            const spotDisplay = document.querySelector(".top p");
            if (available <= 0) {
                spotDisplay.textContent = "No spots available";
            } else {
                spotDisplay.textContent = `Available spots: ${available}`;
            }

            const bookBtn = document.querySelector(".bookTour") as HTMLButtonElement;
            bookBtn.disabled = available <= 0;
        })
        .catch(error => {
            console.error("Error while loading available spots:", error.message);
        });
}


function renderTour(tour: Tour) {
    generateTourCard(tour);
    attachEventListeners(tour);
    generateTourKeyPoints(tour);
    loadAvailableSpots(tour); 
}

function generateTourCard(tour: Tour) {
    const tourContainer = document.querySelector(".tour-content");
    tourContainer.innerHTML = '';

    tourContainer.innerHTML = `
            <div class="tour-img">
                <img src="${imageUrl}" alt="${tour.name}">
            </div>
            <div class="tour-details">
                <div class="top">
                    <h1>${tour.name}</h1>
                    <p></p>
                </div>
                <div class="middle">
                    <div id="date">${new Date(tour.dateTime).toLocaleString("sr-RS", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                        })}
                    </div>
                    <div id="description">${tour.description}</div>
                </div>
                <div class="bottom">
                <div class="guest-counter">
                    <button class="decrease">-</button>
                    <span id="guest-count">1</span>
                    <button class="increase">+</button>
                </div>
                    <button class='bookTour'>Book tour</button>
                </div>
            </div>`;
}

function generateTourKeyPoints(tour: Tour) {
    const kpContainer = document.querySelector(".key-point-content");

    if(tour.keyPoints.length === 0){
        kpContainer.innerHTML = "No key-points found";
        return;
    }

    kpContainer.innerHTML = tour.keyPoints.map(kp => `
        <div class="key-point">
            <div class="key-point-img">
                <img src="${imageUrl}" alt="${kp.name}" />
            </div>
            <div class="key-point-info">
                <h1>${kp.name}</h1>
                <p>latitude: ${kp.latitude}  longitude: ${kp.longitude}</p>
                <div class="key-point-description">
                    <p>${kp.description}</p>
                </div>
            </div>
        </div>
        `).join('');
}

function attachEventListeners(tour: Tour){
    let guestCount = 1;
    const countDisplay = document.getElementById("guest-count");
    const increaseBtn = document.querySelector(".increase");
    const decreaseBtn = document.querySelector(".decrease");

    increaseBtn.addEventListener("click", () => {
        if (guestCount < tour.maxGuests) {
            guestCount++;
            countDisplay.textContent = guestCount.toString();
        }
    });

    decreaseBtn.addEventListener("click", () => {
        if (guestCount > 1) {
            guestCount--;
            countDisplay.textContent = guestCount.toString();
        }
    });

    const bookBtn = document.querySelector(".bookTour");
    bookBtn.addEventListener("click", () => {
    const reservation = {
        tourId: tour.id,
        userId: userId, 
        numberOfPeople: guestCount
    };

    resService.createReservation(reservation)
        .then(() => {
            alert("Successfully created reservation!");
            loadAvailableSpots(tour); 
            window.location.href = "../reservations/reservations.html"
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error occurred while loading reservations.");
        });
    }); 
};

loadTour();

