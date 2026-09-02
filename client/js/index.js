const cat = document.querySelector("#cat");

cat.innerHTML = "<option>All</option>" + categories.map( (x) => `<option>${esc(x)}</option>`).join("");


document.querySelector("#pills").innerHTML =
  `<button class="category-pill active" data-c="All"> All </button>` + categories.map((x) =>
        `<button class="category-pill" data-c="${esc(x)}"> ${esc(x)} </button>`
    ).join("");

let state = {
  q: "",
  c: "All",
  max: "",
  sort: "newest"
};

async function render() {
  let listings;
  let wishlistIds = [];

  try {

    listings = await getListings();

    wishlistIds =
      await getWishlistIds();

  } catch (error) {

    console.error(error);

    document.querySelector("#grid").innerHTML = `
      <div class="card">
        <h3>
          Unable to load listings
        </h3>

        <p>
          Please check that the
          CampusKart server is running.
        </p>
      </div>
    `;

    document.querySelector("#count").textContent = "Unable to load listings.";
    return;
  }


  let a = listings;

  if (state.q) {
    a = a.filter((x) =>
      (x.title + " " + x.description).toLowerCase().includes(state.q.toLowerCase())
    );
  }

  if (state.c !== "All") {
    a = a.filter((x) => x.category === state.c);
  }

  if (state.max) {
    a = a.filter((x) => x.price <= Number(state.max));
  }


  a.sort((x, y) => {

    if (state.sort === "low") {
      return x.price - y.price;
    }

    if (state.sort === "high") {
      return y.price - x.price;
    }

    return (
      new Date(y.createdAt) -
      new Date(x.createdAt)
    );
  });

  document.querySelector(
    "#grid"
  ).innerHTML =

    a.map((x) => {

      const saved =
        wishlistIds.includes(
          x._id
        );

      return `
        <article class="card">

          <div class="image-container">

            <a
              href="listing.html?id=${x._id}">
              <img
                src="${esc(x.image)}"
                alt="${esc(x.title)}"
              >
            </a>
            ${ x.isSold ? `<div class="sold-overlay"><span>SOLD</span></div>`: ""}
            <button class="heart ${ saved ? "saved" : "" }"
              data-save="${x._id}"
              title="${ saved ? "Remove from wishlist" : "Save to wishlist" }">
              ${saved ? "♥" : "♡"}
            </button>
          </div>

          <b>
            ${esc(x.category)}
          </b>

          <h3>
            <a href="listing.html?id=${x._id}">
              ${esc(x.title)}
            </a>
          </h3>

          <strong>
            ${fmt(x.price)}
          </strong>

          <p>
            ${esc(x.description)}
          </p>

        </article>
      `;

    }).join("")

    ||

    `
      <div class="card">
        <h3>
          No listings found
        </h3>

        <p>
          Try changing your filters.
        </p>

      </div>
    `;


  document.querySelector("#count").textContent = `${a.length} listings available.`; 
}

document.querySelector("#search").oninput = (e) => {
  state.q = e.target.value;
  document.querySelector("#mirror").value = state.q;
  render();
};


document.querySelector("#mirror").oninput = (e) => {
  state.q = e.target.value;
  document.querySelector("#search").value = state.q;
  render();
};

document.querySelector("#cat").onchange = (e) => {
  state.c = e.target.value;
  document.querySelectorAll(".category-pill").forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.c === state.c);
    });
  render();
};

document.querySelector("#max").oninput = (e) => {
  state.max = e.target.value;
  render();
};

document.querySelector("#sort").onchange = (e) => {
  state.sort = e.target.value;
  render();
};

document.addEventListener("click", async (e) => {
    const categoryButton = e.target.closest("[data-c]");
    if (categoryButton) {
      document.querySelectorAll(".category-pill").forEach((pill) => {
          pill.classList.remove("active");
      });
      categoryButton.classList.add("active");
      state.c = categoryButton.dataset.c;
      cat.value = state.c;
      render();
      return;
    }

    if ( e.target.closest("#clear") ) {
      document.querySelector("#search").value = "";
      document.querySelector("#mirror").value = "";
      document.querySelector("#cat").value = "All";
      document.querySelector("#max").value = "";
      document.querySelector("#sort").value = "newest";

      state = {
        q: "",
        c: "All",
        max: "",
        sort: "newest"
      };

      document.querySelectorAll(".category-pill").forEach((pill) => {
          pill.classList.remove("active");
        });

      document.querySelector('.category-pill[data-c="All"]')?.classList.add("active");
      render();
      return;
    }

    const heart =e.target.closest("[data-save]");
    if (!heart) {
      return;
    }

    const token = localStorage.getItem("campuskart_token");

    if (!token) {
      alert("Please login to save listings.");
      window.location.href = "login.html";
      return;
    }

    const listingId = heart.dataset.save;
    const isCurrentlySaved = heart.classList.contains("saved");
    try {
      let response;
      if (!isCurrentlySaved) {

        response = await fetch(
          `${API_URL}/wishlist/${listingId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`
              }
            }
          );

      } else {

        // REMOVE
        response = await fetch(
            `${API_URL}/wishlist/${listingId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
      }


      const result = await response.json();
      if (!response.ok) {

        throw new Error( result.message ||
          "Could not update wishlist."
        );

      }

      toast(
          isCurrentlySaved
          ? "Removed from wishlist"
          : "Saved to wishlist"
      );
      await render();

    } catch (error) {

      console.error( "Wishlist error:", error );
      alert( error.message || "Could not update wishlist." );
    }
  }
);

render();