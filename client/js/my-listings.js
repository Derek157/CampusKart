const token =
  localStorage.getItem("campuskart_token");

if (!token) {
  location.href = "login.html";
}

async function loadMyListings() {

  try {

    const response = await fetch(
      `${API_URL}/listings/mine`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const a =
      await response.json();

    if (!response.ok) {
      throw new Error(
        a.message ||
        "Failed to load listings."
      );
    }


    const activeListings =
      a.filter(
        (x) => !x.isSold
      );

    const soldListings =
      a.filter(
        (x) => x.isSold
      );


    document.querySelector(
      "#stats"
    ).innerHTML = `

      <div class="dashboard-stat">
        <span>Total listings</span>
        <strong>${a.length}</strong>
      </div>

      <div class="dashboard-stat">
        <span>Active listings</span>
        <strong>${activeListings.length}</strong>
      </div>

      <div class="dashboard-stat">
        <span>Sold listings</span>
        <strong>${soldListings.length}</strong>
      </div>

    `;


    document.querySelector(
      "#mine"
    ).innerHTML =

      a.map(
        (x) => `

          <article
            class="dashboard-row"
          >

            <img
              src="${esc(x.image)}"
              alt="${esc(x.title)}"
            />

            <div>

              <small>
                ${esc(x.category)}
                ·
                ${fmt(x.price)}
              </small>

              <h3>
                ${esc(x.title)}
              </h3>

              <p>
                ${
                  x.isSold
                    ? "Sold"
                    : "Active"
                }
              </p>

            </div>

            <div
              class="dashboard-actions"
            >

              <button
                data-view="${x._id}"
              >
                View
              </button>

              <button
                data-sold="${x._id}"
              >
                ${
                  x.isSold
                    ? "Mark active"
                    : "Mark sold"
                }
              </button>

              <button
                data-delete="${x._id}"
              >
                Delete
              </button>

            </div>

          </article>
        `
      ).join("")

      ||

      `
        <div class="card">
          <h3>No listings yet</h3>

          <p>
            You haven't added any
            items for sale.
          </p>

          <a href="sell.html">
            Sell your first item
          </a>
        </div>
      `;

  } catch (error) {

    console.error(error);

    document.querySelector(
      "#mine"
    ).innerHTML = `
      <div class="card">
        <h3>Unable to load your listings</h3>
        <p>
          Please make sure the server
          is running.
        </p>
      </div>
    `;
  }
}


loadMyListings();



document.addEventListener("click", async (e) => {

  const viewButton = e.target.closest("[data-view]");

  if (viewButton) {
    const id = viewButton.dataset.view;
    window.location.href = `listing.html?id=${id}`;
    return;
  }

  const soldButton = e.target.closest("[data-sold]");
  if (soldButton) {
    const id = soldButton.dataset.sold;

    try {

      const response =
        await fetch(
          `${API_URL}/listings/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const listing = await response.json();

      if (!response.ok) {
        throw new Error(
          listing.message ||
          "Could not find listing."
        );
      }


      const updateResponse =
        await fetch(
          `${API_URL}/listings/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type" : "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
              isSold:
                !listing.isSold
            })
          }
        );

      const result = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(
          result.message ||
          "Could not update listing."
        );
      }

      loadMyListings();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    return;
  }

  const deleteButton = e.target.closest("[data-delete]");
  if (deleteButton) {
    const id =
      deleteButton.dataset.delete;

    const confirmed =
      confirm(
        "Are you sure you want to delete this listing?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
          `${API_URL}/listings/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Could not delete listing."
        );
      }

      alert(
        "Listing deleted successfully."
      );

      loadMyListings();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

});