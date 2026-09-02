const express = require("express");

const Listing = require("../models/Listing");
const requireAuth = require("../middleware/auth");

const router = express.Router();


// ========================================
// GET ALL LISTINGS
// GET /api/listings
// ========================================

router.get("/", async (req, res) => {
  try {

    const listings =
      await Listing.find()
        .populate(
          "seller",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(listings);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch listings.",
    });
  }
});


// ========================================
// GET MY LISTINGS
// GET /api/listings/mine
// ========================================

router.get(
  "/mine",
  requireAuth,
  async (req, res) => {

    try {

      const listings =
        await Listing.find({
          seller: req.userId,
        })
          .populate(
            "seller",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(listings);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch your listings.",
      });
    }
  }
);


// ========================================
// GET SINGLE LISTING
// GET /api/listings/:id
// ========================================

router.get(
  "/:id",
  async (req, res) => {

    try {

      const listing =
        await Listing.findById(
          req.params.id
        ).populate(
          "seller",
          "name email"
        );

      if (!listing) {

        return res.status(404).json({
          message:
            "Listing not found.",
        });
      }

      res.json(listing);

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          "Invalid listing ID.",
      });
    }
  }
);


// ========================================
// CREATE LISTING
// POST /api/listings
// ========================================

router.post(
  "/",
  requireAuth,
  async (req, res) => {

    try {

      const {
        title,
        description,
        price,
        category,
        condition,
        image,
        location,
      } = req.body;


      if (
        !title ||
        !description ||
        price === undefined ||
        !category ||
        !condition
      ) {

        return res.status(400).json({
          message:
            "Required listing fields are missing.",
        });
      }


      if (Number(price) <= 0) {

        return res.status(400).json({
          message:
            "Price must be greater than 0.",
        });
      }


      const listing =
        await Listing.create({

          title:
            title.trim(),

          description:
            description.trim(),

          price:
            Number(price),

          category,

          condition,

          image:
            image || "",

          location:
            location || "",

          seller:
            req.userId,
        });


      const populatedListing =
        await listing.populate(
          "seller",
          "name email"
        );


      res.status(201).json(
        populatedListing
      );

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          "Could not create listing.",
      });
    }
  }
);


// ========================================
// UPDATE LISTING
// PATCH /api/listings/:id
// ========================================

router.patch(
  "/:id",
  requireAuth,
  async (req, res) => {

    try {

      const listing =
        await Listing.findById(
          req.params.id
        );


      if (!listing) {

        return res.status(404).json({
          message:
            "Listing not found.",
        });
      }


      if (
        listing.seller.toString() !==
        req.userId
      ) {

        return res.status(403).json({
          message:
            "You can only edit your own listings.",
        });
      }


      const allowedFields = [
        "title",
        "description",
        "price",
        "category",
        "condition",
        "image",
        "location",
        "isSold",
      ];


      for (
        const field of allowedFields
      ) {

        if (
          req.body[field] !==
          undefined
        ) {

          listing[field] =
            req.body[field];
        }
      }


      await listing.save();


      const updatedListing =
        await listing.populate(
          "seller",
          "name email"
        );


      res.json(
        updatedListing
      );

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          "Could not update listing.",
      });
    }
  }
);


// ========================================
// DELETE LISTING
// DELETE /api/listings/:id
// ========================================

router.delete(
  "/:id",
  requireAuth,
  async (req, res) => {

    try {

      const listing =
        await Listing.findById(
          req.params.id
        );


      if (!listing) {

        return res.status(404).json({
          message:
            "Listing not found.",
        });
      }


      if (
        listing.seller.toString() !==
        req.userId
      ) {

        return res.status(403).json({
          message:
            "You can only delete your own listings.",
        });
      }


      await listing.deleteOne();


      res.json({
        message:
          "Listing deleted successfully.",
      });

    } catch (error) {

      console.error(error);

      res.status(400).json({
        message:
          "Could not delete listing.",
      });
    }
  }
);


module.exports = router;