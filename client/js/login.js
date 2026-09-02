const form = document.querySelector("#form");

form.addEventListener("submit", async (e) => { e.preventDefault();

  const email = document.querySelector("#email").value.trim();

  const password = document.querySelector("#password").value;

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Login failed."
      );
    }

    localStorage.setItem(
      "campuskart_token",
      data.token
    );

    localStorage.setItem(
      "campuskart_user",
      JSON.stringify(data.user)
    );

    alert(`Welcome back, ${data.user.name}!`);

    window.location.href = "index.html";

  } catch (error) {
    console.error("Login error:", error);

    alert(error.message);
  }
});