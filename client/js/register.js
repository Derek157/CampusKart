const form = document.querySelector("#form");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const error = document.querySelector("#error");


form.addEventListener("submit", async (e) => {

  e.preventDefault();

  error.textContent = "";


  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!name || !email || !password) {
    error.textContent = "Please fill in all fields.";
    return;
  }

  if (password.length < 6) {
    error.textContent = "Password must be at least 6 characters.";
    return;
  }

  try {

    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    );


    const data = await response.json();


    // -----------------------------
    // Handle backend error
    // -----------------------------

    if (!response.ok) {

      error.textContent =
        data.message ||
        "Registration failed.";

      return;
    }


    // -----------------------------
    // Save login information
    // -----------------------------

    localStorage.setItem(
      "campuskart_token",
      data.token
    );

    localStorage.setItem(
      "campuskart_user",
      JSON.stringify(data.user)
    );


    // -----------------------------
    // Registration successful
    // -----------------------------

    window.location.href =
      "index.html";

  } catch (err) {

    console.error(err);

    error.textContent =
      "Unable to connect to the server.";

  }

});