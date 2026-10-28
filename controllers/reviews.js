const Listening = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.createReview=async (req, res) => {
    let listing = await Listening.findById(req.params.id);

     // ADD THIS CHECK HERE
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
       newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
   req.flash("success", "New Review is Created !");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async (req, res) => {
        let { id, reviewId } = req.params;
        await Listening.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review is Deleted !");
        res.redirect(`/listings/${id}`);
    };