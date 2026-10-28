const express = require("express");
const router = express.Router({mergeParams:true});

const {listingSchema,reviewSchema}=require("../schema.js");
const Listening=require('../models/listings.js');
const Review =require("../models/review.js");
const WrapAsync=require("../utils/WrapAsync.js");

const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Reviews
// Post Route
router.post("/", isLoggedIn, validateReview, WrapAsync(reviewController.createReview));

 // Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    WrapAsync(reviewController.destroyReview)
);

module.exports=router;