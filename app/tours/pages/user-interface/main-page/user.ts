import { TourResults } from "../../../model/tour.model.js";
import { TourService } from "../../../service/tour.service.js";
const tourService = new TourService();
const sortDropdown = document.getElementById("sortDropdown") as HTMLSelectElement;
const orderDropdown = document.getElementById("orderDropdown") as HTMLSelectElement;
const prevPageButton = document.getElementById("prevPage") as HTMLButtonElement;
const nextPageButton = document.getElementById("nextPage") as HTMLButtonElement;
const pageSizeDropdown = document.getElementById("pageSize") as HTMLSelectElement;
const cardGrid = document.querySelector(".card-grid") as HTMLDivElement;

const imageUrl = "https://unbredbombers.ca/wp-content/uploads/2018/05/no-image-1.jpg";

let currentPage = 1;
let pageSize = 5;
let totalPages = 1; 

prevPageButton.addEventListener("click", () =>{
    if (currentPage > 1) {
        currentPage--;
        loadTours();
    }
})
nextPageButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadTours();
    }
})
pageSizeDropdown.addEventListener("change", () => {
    pageSize = parseInt(pageSizeDropdown.value);
    loadTours()
});

sortDropdown.addEventListener("change", () => {
    loadTours()
});

orderDropdown.addEventListener("change", () => {
    loadTours()
});

window.addEventListener("DOMContentLoaded", () => {
    loadTours(); 
});

function loadTours(): void {
    renderData(sortDropdown.value, orderDropdown.value, currentPage, pageSize);
}

function renderData(orderBy: string = "Name", orderDirection: string = "ASC", page: number = 1, size: number = 5): void {
    tourService.getAll(orderBy, orderDirection, page, size)
        .then(result => {
            totalPages = Math.ceil(result.totalCount / size);
            updatePaginationControls();
            renderPageButtons();
            renderTourCards(result);
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error occurred while loading tours.");
        });
}

function updatePaginationControls(): void {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
}

function renderPageButtons(): void {
    const pageCountContainer = document.getElementById("pageCount");
    if (!pageCountContainer) return;

    pageCountContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i.toString();

        pageBtn.classList.toggle("active-page", i === currentPage);

        pageBtn.addEventListener("click", () => {
            currentPage = i;
            loadTours();
        });

        pageCountContainer.appendChild(pageBtn);
    }
}

function renderTourCards(result: TourResults): void {
    cardGrid.innerHTML = "";

    if (result.data.length === 0) {
        cardGrid.innerHTML = "<p>No tours available.</p>";
        return;
    }

    result.data.forEach(tour => {
        const tourEl = document.createElement("div");
        tourEl.className = "tour-card";
        tourEl.setAttribute("data-id", tour.id.toString());
        tourEl.innerHTML = `
            <div class='tour-cardFront'>
                <img src="${imageUrl}" alt="${tour.name}" />
                <div class='info'>
                    <h4>${tour.name}</h4>
                    <p>${new Date(tour.dateTime).toLocaleString("sr-RS", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}</p>
                    <p>Available spots: ${tour.maxGuests}</p> 
                </div>
            </div>
            <div class='tour-cardBack'>
                <h1>${tour.name}</h1>
                <p>${tour.description}</p>
            </div>`;

            tourEl.addEventListener("click", () => {
                const id = tourEl.getAttribute("data-id");
                if(id){
                    window.location.href = `../tour-details/tour-details.html?id=${id}`
                }
            })

        cardGrid.appendChild(tourEl);
    });
}

