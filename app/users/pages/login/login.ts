import { UserService } from "../../service/user.service.js";

const userService = new UserService();
const loginLink = document.querySelector("#login") as HTMLElement;
const logoutLink = document.querySelector("#logout") as HTMLElement;
const submitButton = document.querySelector("#submit") as HTMLElement;

function setUserLoginState(isLoggedIn: boolean) {
  if (isLoggedIn) {
    loginLink.style.display = "none";
    logoutLink.style.display = "block";
  } else {
    loginLink.style.display = "block";
    logoutLink.style.display = "none";
  }
}

function handleLogin(event: Event) {
  event.preventDefault();

  const form = document.querySelector("form") as HTMLFormElement;
  const formData = new FormData(form);
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  userService
    .login(username, password)
    .then((user) => {
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      if (user.role === "vodic") {
        window.location.href =
          "../../../tours/pages/guide-tours/guide-tours.html";
      } else if (user.role === "vlasnik") {
        window.location.href =
          "../../../restaurants/pages/list/myRestaurant.html";
      } else if (user.role === "turista") {
        window.location.href =
          "/app/tours/pages/user-interface/main-page/user.html";
      } else {
        window.location.href = "../../../index.html";
      }
    })
    .catch((error) => {
      console.error("Login failed", error.message);
    });
}

function handleLogout() {
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("currentTouristId");
  localStorage.removeItem("userId");
  setUserLoginState(false);
  window.location.href = "../../../index.html";
}

function checkLoginStatus() {
  const username = localStorage.getItem("username");
  if (username) {
    setUserLoginState(true);
  } else {
    setUserLoginState(false);
  }
}

if (submitButton) {
  submitButton.addEventListener("click", handleLogin);
}

const logoutElement = document.querySelector("#logout");
if (logoutElement) {
  logoutElement.addEventListener("click", handleLogout);
}

checkLoginStatus();
