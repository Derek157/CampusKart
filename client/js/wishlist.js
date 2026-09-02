const token = localStorage.getItem( "campuskart_token");

if (!token) {
  window.location.href = "login.html";
}
async function loadWishlist() {
  try {
    const response = await fetch(`${API_URL}/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    const listings = await response.json();

    if (!response.ok) {
      throw new Error(listings.message || "Failed to load wishlist.");
    }

    const wish = document.querySelector("#wish");
    wish.innerHTML = listings.map((x) => `
            <article class="wish-card">
              <div class="wish-photo">
                <a href="listing.html?id=${x._id}">
                  <img
                    src="${esc(x.image)}"
                    alt="${esc(x.title)}">
                </a>
                <button
                  class="wish-remove"
                  data-save="${x._id}"
                  title="Remove from wishlist">
                  ♥
                </button>
              </div>

              <div class="wish-body">
                <div class="wish-top">
                  <small>
                    ${esc(x.category)}
                  </small>
                  <strong class="wish-price">
                    ${fmt(x.price)}
                  </strong>
                </div>
                <h3>
                  <a
                    href="listing.html?id=${x._id}"
                  >
                    ${esc(x.title)}
                  </a>
                </h3>

                <p>
                  ${esc(x.description)}
                </p>

              </div>
            </article>
          `
        ).join("")
      ||
      `
        <div class="wish-empty">

          <h2>
            Nothing saved yet
          </h2>

          <p>
            Save interesting items from
            the marketplace and
            they'll appear here.
          </p>

          <a href="index.html">
            ← Browse marketplace
          </a>

        </div>
      `;

  } catch (error) {
    console.error("Wishlist error:", error);

    document.querySelector("#wish").innerHTML = `
      <div class="wish-empty">
        <h2>
          Unable to load wishlist
        </h2>
        <p>
          ${esc(error.message)}
        </p>
        <a href="index.html">
          ← Back to marketplace
        </a>
      </div>
    `;
  }
}

document.addEventListener("click", async (e) => {
    const button = e.target.closest("[data-save]");
    if (!button) {
      return;
    }

    const listingId = button.dataset.save;
    try {
      const response =
        await fetch(
          `${API_URL}/wishlist/${listingId}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Could not remove listing."
        );
      }

      toast(
        "Removed from wishlist"
      );
      await loadWishlist();

    } catch (error) {

      console.error(
        "Remove wishlist error:",
        error
      );

      alert(error.message);
    }
  }
);

loadWishlist();