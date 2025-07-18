import { checkLoginStatus, handleLogout } from "./users/service/auth.js";

checkLoginStatus();

const logoutElement = document.getElementById("logout");
if (logoutElement) {
  logoutElement.addEventListener("click", handleLogout);
}
