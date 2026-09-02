const form = document.querySelector("#form");

const titleInput =
  document.querySelector("#title");

const descriptionInput =
  document.querySelector("#description");

const priceInput =
  document.querySelector("#price");

const categoryInput =
  document.querySelector("#category");

const conditionInput =
  document.querySelector("#condition");

const locationInput =
  document.querySelector("#location");

const imageInput =
  document.querySelector("#image");


categoryInput.innerHTML =
  categories.map((category) =>
        `<option value="${esc(category)}">
          ${esc(category)}
        </option>`
    )
    .join("");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem(
        "campuskart_token" );

    if (!token) {
      alert(
        "Please log in before creating a listing."
      );
      window.location.href =
        "login.html";
      return;
    }
    const listingData = { title:
        titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      price: Number(priceInput.value),
      category: categoryInput.value,
      condition: conditionInput.value,
      location: locationInput.value.trim(),
      image: imageInput.value.trim()
    };
           
    if (
      !listingData.title ||
      !listingData.description ||
      !listingData.price ||
      !listingData.category ||
      !listingData.condition
    ) {

      alert(
        "Please fill in all required fields."
      );

      return;
    }

    try {

      const response =
        await fetch( `${API_URL}/listings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify( listingData )
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Could not create listing."
        );

        return;
      }

      alert(
        "Listing published successfully!"
      );

      window.location.href =
        "my-listings.html";

    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to the server."
      );
    }
  }
);