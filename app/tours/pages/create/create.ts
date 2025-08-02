import { TourService } from "../../service/tour.service.js";
import { Tour, KeyPoint } from "../../model/tour.model.js";
import { checkLoginStatus } from "../../../users/service/auth.js";

//#region HTML el. i neophodno
checkLoginStatus();
const tourService = new TourService();
const guideId = localStorage.getItem('userId');

const form = document.querySelector("#newTourForm") as HTMLFormElement;
const requiredFields = form.querySelectorAll("input[required], textarea[required]");

//dohvatanje id-ja za edit ture
const parms = new URLSearchParams(window.location.search);
const id = Number(parms.get('id'));

let createdTourId = null;
const keyPoints: KeyPoint[] = [];

const step1 = document.getElementById("step1") as HTMLDivElement;
const step2 = document.getElementById("step2") as HTMLDivElement;
const step3 = document.getElementById("step3") as HTMLDivElement;

//dugmad
const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
const prevToStep1 = document.getElementById("prevToStep1") as HTMLButtonElement;
const toPreview = document.getElementById("toPreview") as HTMLButtonElement;
const prevToStep2 = document.getElementById("prevToStep2") as HTMLButtonElement;
const submitAll = document.getElementById("submitAll") as HTMLButtonElement;

//key-point el.
const keypointForm = document.getElementById("keypoint-form") as HTMLFormElement;
const kpList = document.getElementById("keypoint-list") as HTMLDListElement;
const warning = document.getElementById("keypoint-warning") as HTMLElement;
const kpTitle = document.getElementById("keypoint-title") as HTMLInputElement;
const kpDesc = document.getElementById("keypoint-description")as HTMLInputElement;
const kpImage = document.getElementById("keypoint-image")as HTMLTextAreaElement;
const kpLat = document.getElementById("keypoint-lat")as HTMLInputElement;
const kpLng = document.getElementById("keypoint-lng")as HTMLInputElement;
//#endregion

function showStep(step) {
  step1.style.display = step === 1 ? "block" : "none";
  step2.style.display = step === 2 ? "block" : "none";
  step3.style.display = step === 3 ? "block" : "none";
}

//#region edit
if(id){
    fillFormForEdit(id);
}

function fillFormForEdit(id: number){
     tourService.getById(id)
    .then(tour =>{
        createdTourId = tour.id;
        (document.querySelector("#name") as HTMLInputElement).value = tour.name;
        (document.querySelector("#description") as HTMLInputElement).value = tour.description;
        (document.querySelector("#dateTime") as HTMLInputElement).value = tour.dateTime;
        (document.querySelector("#maxGuests") as HTMLInputElement).value = tour.maxGuests.toString();

        keyPoints.length = 0; 
        tour.keyPoints.forEach(kp => keyPoints.push(kp));
        renderKeyPoints();
    })
    .catch (error => {
        console.error("Error while loading tour:", error);
    })
}
//#endregion

//#region osnovna forma
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
//#endregion

//#region validacija
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
//#endregion

//#region komunikacija sa serverom
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
//#endregion

//#region key-point
nextBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const tourData = getFormData();
    if (!isFormValid()) {
        alert("Please fill in all required fields.");
        return;
    }
    if(!createdTourId){
        tourService.createTour(tourData).then(t => {
        createdTourId = t.id;
        showStep(2);
        });
    }
    else{
        showStep(2);}
});

prevToStep1.addEventListener("click", () => showStep(1));

keypointForm.addEventListener("submit", e => {
    e.preventDefault();
    const kp = {
        order: keyPoints.length + 1,
        name: kpTitle.value.trim(),
        description: kpDesc.value.trim(),
        imageUrl: kpImage.value.trim(),
        latitude: parseFloat(kpLat.value),
        longitude: parseFloat(kpLng.value),
        tourId: createdTourId
    };

    if(kp.description.length < 250){
        alert("Description must be at least 250 characters.");
        return;
    }
    tourService.createKeyPoint(createdTourId, kp).then( res => {
        keyPoints.push(res);
        renderKeyPoints();
        keypointForm.reset();
    })
})

function renderKeyPoints() {
    kpList.innerHTML = "";
    keyPoints.forEach((kp, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="kp-header">
                <strong>${kp.name}</strong>
                <div class="button-container">
                    <button class="toggle-desc">Show</button>
                    <button data-index="${index}" data-id="${kp.id}" class="delete-btn">Delete</button>
                </div>
            </div>
            <div class="kp-desc" style="display: none;">${kp.description}</div>
        `;
        kpList.appendChild(li);
    });

    const valid = keyPoints.length >= 2 && keyPoints.every(kp => kp.description.length >= 250);
    toPreview.disabled = !valid;
    warning.style.display = valid ? "none" : "block";
}

kpList.addEventListener("click", e => {
    const target = e.target as HTMLElement;

    if (target.classList.contains("delete-btn")) {
        const index = target.dataset.index;
        const id = target.dataset.id;
        tourService.deleteKeyPoint(createdTourId, Number(id)).then(() => {
            keyPoints.splice(Number(index), 1);
            renderKeyPoints();
        });
    }

    if (target.classList.contains("toggle-desc")) {
        const li = target.closest("li")!;
        const descDiv = li.querySelector(".kp-desc") as HTMLElement;
        const isVisible = descDiv.style.display === "block";
        descDiv.style.display = isVisible ? "none" : "block";
        target.textContent = isVisible ? "Show" : "Hide";
    }
});

toPreview.addEventListener("click", () => {
    const preview = document.getElementById("previewContainer");
    const tourData = getFormData();
    preview.innerHTML = `
        <p><strong>Name:</strong> ${tourData.name}</p>
        <p><strong>Description:</strong> ${tourData.description}</p>
        <p><strong>Date:</strong> ${new Date(tourData.dateTime).toLocaleString()}</p>
        <p><strong>Max guests:</strong> ${tourData.maxGuests}</p>
        <h4>Key Points:</h4>
        <div class="kp-cards">
            ${keyPoints.map((kp, i) => `
                <div class="kp-card">
                    <div class="kp-card-header" data-index="${i}">
                        <strong>${kp.name}</strong>
                        <button class="kp-toggle">Show</button>
                    </div>
                    <div class="kp-card-body" style="display: none;">
                        <p>${kp.description.slice(0, 300)}...</p>
                    </div>
                </div>
            `).join("")}
        </div>
    `;
    showStep(3);

    const toggleButtons = preview.querySelectorAll(".kp-toggle");
    toggleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const card = (btn as HTMLElement).closest(".kp-card")!;
            const body = card.querySelector(".kp-card-body") as HTMLElement;
            const isShown = body.style.display === "block";
            body.style.display = isShown ? "none" : "block";
            btn.textContent = isShown ? "Show" : "Hide";
        });
    });
});

prevToStep2.addEventListener("click", () => showStep(2));

submitAll.addEventListener("click", () => {
    tourService.updateTour(createdTourId, { ...getFormData(), status: "objavljena" }).then(() => {
        alert("Tour published!");
        window.location.href = "../../../tours/pages/guide-tours/guide-tours.html";
    });
});
//#endregion