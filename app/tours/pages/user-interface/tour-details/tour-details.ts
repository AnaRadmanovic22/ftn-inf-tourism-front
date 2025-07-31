import { Tour } from "../../../model/tour.model.js";
import { TourService } from "../../../service/tour.service.js";

const tourService = new TourService();
const imageUrl = "https://unbredbombers.ca/wp-content/uploads/2018/05/no-image-1.jpg";

const parms = new URLSearchParams(window.location.search);
const tourId = Number(parms.get("id"));

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

function renderTour(tour: Tour) {
    generateTourCard(tour);
    generateTourKeyPoints(tour);
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
                    <p>Available spots: ${tour.maxGuests}</p>
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
                    <button>Book tour</button>
                </div>
            </div>`;
}

//#region sledeci deo zadatka
// document.querySelector("#book-btn")?.addEventListener("click", () => {
//   if (!userIsLoggedIn()) {
//     showLoginPopup(); // popup kod
//   } else {
//     redirectToPayment(tourId);
//   }
// });
//#endregion

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

loadTour();

