import { TourService } from "../../service/tour.service.js";
import { Tour } from "../../model/tour.model.js";
import { checkLoginStatus } from "../../../users/service/auth.js";
checkLoginStatus();
const tourService = new TourService();
const toursList = document.getElementById("toursList")!;
const guideId = Number(localStorage.getItem("userId"));

document.getElementById("createTourBtn").addEventListener("click", () => {
    window.location.href = "/app/tours/pages/create/create.html";
});

function attachDeleteListener(){
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number((btn as HTMLElement).getAttribute("data-id"));
            const confirmed = confirm("Are you sure you want to delete this tour?");
            if (confirmed) {
                tourService.removeTourById(id)
                    .then(() => {
                        loadTours();
                    })
                    .catch(err => {
                        alert("Error deleting tour: " + err.message);
                    });
            }
        });
    });
}

function attachEditListener(){
     const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = (btn as HTMLElement).getAttribute("data-id");
            window.location.href = `../../../tours/pages/create/create.html?id=${id}`;
        });
    });
}

function renderTours(tours: Tour[]) {
    if (tours.length === 0) {
        toursList.innerHTML = "<p>No tours found.</p>";
        return;
    }
    generateTourCards(tours);
    attachEditListener();
    attachDeleteListener();
}

function generateTourCards(tours: Tour[]) {
    toursList.innerHTML = tours.map(t => `
        <div class="tour-card">
            <h3>${t.name}</h3>
            <p>${t.description}</p>
            <p><strong>Date:</strong> ${new Date(t.dateTime).toLocaleString()}</p>
            <p><strong>Max guests:</strong> ${t.maxGuests}</p>
            <p><strong>Status:</strong> ${t.status}</p>
            <div class="actions">
                <button class="edit-btn" data-id="${t.id}">Edit</button>
                <button class="delete-btn" data-id="${t.id}">Delete</button>
            </div>
        </div>
    `).join("");
}

function loadTours() {
    tourService.getAllByGuide(guideId)
        .then(result => {
            renderTours(result);
        })
        .catch(err => {
            toursList.innerHTML = `<p class="error">Error loading tours: ${err.message}</p>`;
        });
}

loadTours();
