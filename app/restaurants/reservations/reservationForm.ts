export function reservationHandler(restaurantId: number) {
  const openReservationFormBtn = document.getElementById(
    "openReservationFormBtn"
  ) as HTMLButtonElement;
  const reservationFormDiv = document.getElementById(
    "reservationForm"
  ) as HTMLDivElement;
  const closeReservationFormBtn = document.getElementById(
    "closeReservationFormBtn"
  ) as HTMLButtonElement;
  const makeReservationForm = document.getElementById(
    "makeReservationForm"
  ) as HTMLFormElement;
  const reservationFormMsg = document.getElementById(
    "reservationFormMsg"
  ) as HTMLDivElement;

  openReservationFormBtn.addEventListener("click", () => {
    reservationFormDiv.style.display = "block";
  });

  closeReservationFormBtn.addEventListener("click", () => {
    reservationFormDiv.style.display = "none";
    reservationFormMsg.innerText = "";
  });
  makeReservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const date = (
      document.getElementById("reservationDate") as HTMLInputElement
    ).value;
    const mealType = (document.getElementById("mealType") as HTMLSelectElement)
      .value as "Breakfast" | "Lunch" | "Dinner";
    const numberOfGuests = Number(
      (document.getElementById("numberOfGuests") as HTMLInputElement).value
    );

    const touristId = Number(localStorage.getItem("currentTouristId") || "1");

    const reservation = {
      restaurantId,
      touristId,
      date,
      mealType,
      numberOfGuests,
    };

    fetch(
      `http://localhost:5105/api/restaurants/${restaurantId}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      }
    )
      .then((res) => {
        if (res.ok) {
          reservationFormMsg.innerText = "Rezervacija uspesna!";
          reservationFormMsg.style.color = "green";
          setTimeout(() => {
            reservationFormDiv.style.display = "none";
            reservationFormMsg.innerText = "";
          }, 2000);
        } else {
          res
            .json()
            .then(function (data) {
              reservationFormMsg.innerText =
                "Greska: " +
                (data && data.message
                  ? data.message
                  : "Rezervacija nije uspela.");
              reservationFormMsg.style.color = "red";
            })
            .catch(function () {
              reservationFormMsg.innerText = "Greska: Rezervacija nije uspela.";
              reservationFormMsg.style.color = "red";
            });
        }
      })
      .catch(function () {
        reservationFormMsg.innerText = "Greska u komunikaciji sa serverom.";
        reservationFormMsg.style.color = "red";
      });
  });
}
