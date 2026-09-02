const id =
  new URLSearchParams(location.search).get("id");

const d = document.querySelector("#detail");

async function loadListing() {

  if (!id) {

    d.innerHTML = `
      <div class="not-found">

        <div class="not-found-icon">
          !
        </div>

        <h2>Listing not found</h2>

        <p>
          No listing ID was provided.
        </p>

        <a
          href="index.html"
          class="back-home"
        >
          ← Back to marketplace
        </a>

      </div>
    `;

    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/listings/${id}`
      );


    const data =
      await response.json();

      if (!response.ok) {

      throw new Error(
        data.message ||
        "Listing not found"
      );
    }


    const x = data;

    d.innerHTML = `

      <div class="listing-photo">

        <img
          src="${esc(x.image)}"
          alt="${esc(x.title)}"
        />

      </div>


      <div class="listing-info">

        <small class="listing-category">
          ${esc(x.category)}
          ·
          ${esc(x.condition)}
        </small>


        <h1>
          ${esc(x.title)}
        </h1>


        <div class="listing-price">
          ${fmt(x.price)}
        </div>


        <p class="listing-description">
          ${esc(x.description)}
        </p>


        <div class="listing-meta">
          ⌖ ${esc(x.location)}
        </div>


        ${
          x.isSold
            ? `
              <div class="sold-badge">
                SOLD
              </div>
            `
            : ""
        }


        <div class="seller-box">

          <div class="seller-header">

            <div class="seller-avatar">
              ${esc(
                x.seller.name
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>


            <div>

              <b>
                ${esc(x.seller.name)}
              </b>

              <p>
                ✓ Campus seller
              </p>

            </div>

          </div>


          <div class="seller-actions">

            ${
              x.isSold
                ? `
                  <div
                    class="contact contact-alt"
                  >
                    This item has been sold
                  </div>
                `
                : `
                  <a
                    class="contact contact-main"
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                      x.seller.email
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Email seller
                  </a>
                `
            }


            <a
              class="contact contact-alt"
              href="index.html"
            >
              Back
            </a>

          </div>

        </div>

      </div>

    `;

  } catch (error) {

    console.error(
      "Failed to load listing:",
      error
    );


    d.innerHTML = `

      <div class="not-found">

        <div class="not-found-icon">
          !
        </div>

        <h2>
          Listing not found
        </h2>

        <p>
          This listing may have been
          removed or the link is invalid.
        </p>

        <a
          href="index.html"
          class="back-home"
        >
          ← Back to marketplace
        </a>

      </div>

    `;
  }
}

loadListing();