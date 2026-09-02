const express = require("express");

const Wishlist = require("../models/Wishlist");
const Listing = require("../models/Listing");
const requireAuth = require("../middleware/auth");

const router = express.Router();


// ========================================
// GET WISHLIST
// GET /api/wishlist
// ========================================

router.get("/", requireAuth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.userId,
    }).populate({
      path: "listings",
      populate: {
        path: "seller",
        select: "name email",
      },
    });

    if (!wishlist) {
      return res.json([]);
    }

    res.json(wishlist.listings);

  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      message: "Failed to fetch wishlist.",
    });
  }
});


// ========================================
// ADD TO WISHLIST
// POST /api/wishlist/:listingId
// ========================================

router.post(
  "/:listingId",
  requireAuth,
  async (req, res) => {
    try {
      const { listingId } = req.params;

      const listing =
        await Listing.findById(listingId);

      if (!listing) {
        return res.status(404).json({
          message: "Listing not found.",
        });
      }

      let wishlist =
        await Wishlist.findOne({
          user: req.userId,
        });

      if (!wishlist) {
        wishlist = await Wishlist.create({
          user: req.userId,
          listings: [listingId],
        });
      } else {

        const alreadySaved =
          wishlist.listings.some(
            (id) =>
              id.toString() ===
              listingId
          );

        if (!alreadySaved) {
          wishlist.listings.push(
            listingId
          );

          await wishlist.save();
        }
      }

      res.json({
        message: "Added to wishlist.",
      });

    } catch (error) {
      console.error(
        "Add wishlist error:",
        error
      );

      res.status(400).json({
        message:
          "Could not add listing to wishlist.",
      });
    }
  }
);


// ========================================
// REMOVE FROM WISHLIST
// DELETE /api/wishlist/:listingId
// ========================================

router.delete(
  "/:listingId",
  requireAuth,
  async (req, res) => {
    try {
      const { listingId } = req.params;

      const wishlist =
        await Wishlist.findOne({
          user: req.userId,
        });

      if (!wishlist) {
        return res.status(404).json({
          message: "Wishlist is empty.",
        });
      }

      wishlist.listings =
        wishlist.listings.filter(
          (id) =>
            id.toString() !==
            listingId
        );

      await wishlist.save();

      res.json({
        message:
          "Removed from wishlist.",
      });

    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );

      res.status(400).json({
        message:
          "Could not remove listing from wishlist.",
      });
    }
  }
);


module.exports = router;