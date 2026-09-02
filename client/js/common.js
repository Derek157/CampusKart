const API_URL = "https://campuskart-production-e75a.up.railway.app/api";

const categories = [
  "Books",
  "Electronics",
  "Cycles",
  "Furniture",
  "Appliances",
  "Stationery",
  "Sports",
  "Other",
];


function init() {
  const user = getUser();

  document.querySelectorAll(".auth-only").forEach((x) => {
    x.classList.toggle("hidden", !user);
  });

  document.querySelectorAll(".guest-only").forEach((x) => {
    x.classList.toggle("hidden", !!user);
  });

  if (user) {
    const userName = document.querySelector("#userName");
    const userEmail = document.querySelector("#userEmail");

    if (userName) {
      userName.textContent = user.name;
    }

    if (userEmail) {
      userEmail.textContent = user.email;
    }
  }

  const userButton = document.querySelector("#userButton");
  const userDropdown = document.querySelector("#userDropdown");

  if (userButton && userDropdown) {
    userButton.addEventListener("click", (event) => {
      event.stopPropagation();

      userDropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      userDropdown.classList.remove("open");
    });
  }

  const logoutBtn = document.querySelector("#logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("campuskart_user");
      localStorage.removeItem("campuskart_token");
      window.location.href = "index.html";
    });
  }

}

function getUser() {
  return JSON.parse(localStorage.getItem("campuskart_user") || "null");
}

async function getListings() {
  const response = await fetch(
    `${API_URL}/listings`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch listings.");
  }
  return response.json();
}

async function getWishlistIds() {
  const token =
    localStorage.getItem("campuskart_token");

  if (!token) {
    return [];
  }

  const response = await fetch(
    `${API_URL}/wishlist`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch wishlist."
    );
  }

  const listings =
    await response.json();

  return listings.map(
    (x) => x._id
  );
}



function esc(v = "") {
  return String(v).replace(/[&<>"']/g, (m) =>({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}
function fmt(v) {
  return "₹" + Number(v).toLocaleString("en-IN");
}
function toast(t) {
  let x = document.querySelector("#toast");
  if (!x) return;
  x.textContent = t;
  x.style.opacity = 1;
  setTimeout(() => (x.style.opacity = 0), 2800);
}

document.addEventListener("DOMContentLoaded", init);
