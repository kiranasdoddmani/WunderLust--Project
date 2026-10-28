const express = require("express");
const router = express.Router();

const {listingSchema,reviewSchema}=require("../schema.js");
const Review =require("../models/review.js");
const WrapAsync=require("../utils/WrapAsync.js");
const Listening=require('../models/listings.js');
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController=require("../controllers/listing.js");

const multer  = require('multer')

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ValidateSchema MiddleWare
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router
  .route("/")
  // Index-Route
  .get(WrapAsync(listingController.index))
   // Create-Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
     validateListing,
    WrapAsync(listingController.createListing)
  );

// New-Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
// Show-Route
.get(WrapAsync(listingController.showListing))
// Update Route
.put(isLoggedIn,
    isOwner,
     upload.single("listing[image]"),
    validateListing,
    WrapAsync(listingController.updateListing)
)
// Delete-Route
.delete(isLoggedIn, isOwner, WrapAsync(listingController.destroyListing));

// Update (edit-update)Route

// Edit-Route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(listingController.renderEditForm));

module.exports=router;