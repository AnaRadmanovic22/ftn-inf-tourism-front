import { Tour, KeyPoint, TourResults } from "../model/tour.model";

function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        return response.text().then(text => {
            throw new Error(text || `Request failed. Status: ${response.status}`);
        });
    }
    return response.json();
}

export class TourService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "http://localhost:5105/api/tours";
    }

    getAll(orderBy: string = "Name", orderDirection:string = "ACS", currentPage:number = 1, pageSize:number = 5): Promise<TourResults> {
        const qureyParms = new URLSearchParams({
            orderBy: orderBy,
            orderDirection: orderDirection,
            page: currentPage.toString(),
            pageSize: pageSize.toString()
        });

        const url = `${this.apiUrl}?${qureyParms.toString()}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw { status: response.status, message: response.text }
                }
                return response.json();
            })
            .then((tours: TourResults) => {
                return tours;
            })
            .catch(error => {
                console.error("Error while creating key-point: ", error.message);
                throw error;
            })
    }

    createKeyPoint(tourId: number, keyPoint: KeyPoint): Promise<KeyPoint>{
        const url =`${this.apiUrl}/${tourId}/key-points`;
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(keyPoint)
        })
        .then(response => handleResponse<KeyPoint>(response))
        .then(keyPoint => {
            console.log("Successfully created key-point: ", keyPoint)
            return keyPoint;
        })
        .catch(error => {
            console.error("Error while creating key-point: ", error.message);
            throw error;
        })
    }

    deleteKeyPoint(tourId: number, kpId: number): Promise<void> {
        const url = `${this.apiUrl}/${tourId}/key-points/${kpId}`;
        return fetch(url, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || `Failed to delete key-point. Status: ${response.status}`);
                });
            }
            console.log("Key-point deleted successfully.");
        })
        .catch(error => {
            console.error("Error deleting key-point:", error.message);
            throw error;
        });
    }

    createTour(tour: Tour): Promise<Tour> {
        return fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tour)
        })
        .then(response => handleResponse<Tour>(response))
        .then(tour => {
            console.log("Successfully created tour:", tour);
            return tour;
        })
        .catch(error => {
            console.error("Error creating tour:", error.message);
            throw error;
        });
    }

    getAllByGuide(guideId: number): Promise<Tour[]> {
    const url = `${this.apiUrl}?guideId=${guideId}`;
    return fetch(url)
        .then(response => handleResponse<Tour[]>(response))
        .catch(error => {
            console.error("Error fetching tours:", error.message);
            throw error;
        });
    }

    updateTour(tourId: number, tour: Tour): Promise<Tour> {
        const url = `${this.apiUrl}/${tourId}`;
        return fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tour)
        })
        .then(response => handleResponse<Tour>(response))
        .then(updatedTour => {
            console.log("Tour updated successfully:", updatedTour);
            return updatedTour;
        })
        .catch(error => {
            console.error("Error updating tour:", error.message);
            throw error;
        });
    }

    
    removeTourById(tourId: number): Promise<void> {
        const url = `${this.apiUrl}/${tourId}`;
        return fetch(url, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || `Failed to delete tour. Status: ${response.status}`);
                });
            }
            console.log("Tour deleted successfully.");
        })
        .catch(error => {
            console.error("Error deleting tour:", error.message);
            throw error;
        });
    }

   
    getById(tourId: number): Promise<Tour> {
        const url = `${this.apiUrl}/${tourId}`;
        return fetch(url)
            .then(response => handleResponse<Tour>(response))
            .then(tour => tour)
            .catch(error => {
                console.error("Error fetching tour:", error.message);
                throw error;
            });
    }
}