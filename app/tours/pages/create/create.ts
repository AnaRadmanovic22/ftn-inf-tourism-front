import { TourService } from "../../service/tour.service.js";
import { Tour } from "../../model/tour.model.js";
import { checkLoginStatus } from "../../../users/service/auth.js";
checkLoginStatus();

const tourService = new TourService();
const guideId = localStorage.getItem('userId');
const form = document.querySelector("#newTourForm") as HTMLFormElement;
const requiredFields = form.querySelectorAll("input[required], textarea[required]");

const parms = new URLSearchParams(window.location.search);
const id = Number(parms.get('id'));

if(id){
    fillFormForEdit(id);
}

function fillFormForEdit(id: number){
     tourService.getById(id)
    .then(tour =>{
        (document.querySelector("#name") as HTMLInputElement).value = tour.name;
        (document.querySelector("#description") as HTMLInputElement).value = tour.description;
        (document.querySelector("#dateTime") as HTMLInputElement).value = tour.dateTime;
        (document.querySelector("#maxGuests") as HTMLInputElement).value = tour.maxGuests.toString();
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isFormValid()) {
        alert("Please fill in all required fields.");
        return;
    }
    const tourData = getFormData();
    if(id){
        updateTour(id, tourData);
    }
    else{
       createTour(tourData)
    }
});

function getFormData(): Tour {
    const formData = new FormData(form);
    return {
        guideId: Number(guideId),
        name: formData.get("name")!.toString(),
        description: formData.get("description")!.toString(),
        dateTime: new Date(formData.get("dateTime")!.toString()).toISOString(),
        maxGuests: Number(formData.get("maxGuests"))
    };
}

function isFormValid(): boolean {
    let isValid = true;
    requiredFields.forEach(field => {
        const valid = validateField(field as HTMLInputElement | HTMLTextAreaElement);
        if (!valid) isValid = false;
    });
    return isValid;
}

requiredFields.forEach(field => {
    field.addEventListener("blur", () => {
        validateField(field as HTMLInputElement | HTMLTextAreaElement);
    });
});

function validateField(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const errorSpan = document.getElementById(input.id + "Error")!;
    if (!input.value.trim()) {
        errorSpan.textContent = "This field is required.";
        input.classList.add("invalid");
        return false;
    } else {
        errorSpan.textContent = "";
        input.classList.remove("invalid");
        return true;
    }
}

function updateTour(id: number, tourData: Tour){
    tourService.updateTour(id, tourData)
    .then(() => {
            alert("Tour successfully updated!");
            window.location.href = "../../../tours/pages/guide-tours/guide-tours.html";
        })
        .catch((error) => {
            alert(`Error occurred: ${error.message}`);
        });
}

function createTour(tourData: Tour){
    tourService.createTour(tourData)
    .then(() => {
            alert("Tour successfully created!");
            window.location.href = "../../../tours/pages/guide-tours/guide-tours.html"; 
        })
        .catch((error) => {
            alert(`Error: ${error.message}`);
        });
}


