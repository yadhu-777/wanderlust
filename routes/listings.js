let express = require("express");
let router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/async.js");
const experr = require("../utils/experr.js");
let { listingSchema, reviewSchema } = require("../schema.js");
let path = require("path");
let ejsMate = require("ejs-mate");

let review = require("../models/review.js");
let Listing = require("../models/listing.js");



const validationListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new experr(404, error);
    }
    else {
        next();
    }
}

let reviewValidation = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new experr(404, error);
    }
    else {
        next();
    }
}

router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    let showData = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { showData });


}));


router.get("/", wrapAsync(async (req, res) => {
    let data = await Listing.find();
    res.render("./listings/index.ejs", { data });

}));


router.get("/:id/edit", validationListings, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let ditData = await Listing.findById(id);
    res.render("listings/edit.ejs", { ditData });

}));
//cerate
router.get("/new", (req, res) => {
    res.render("listings/view.ejs");
})

router.put("/:id", validationListings, wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true }, { new: true })
    res.redirect(`/listings/${id}`);
}));



router.post("/", validationListings, wrapAsync(async (req, res, next) => {

    let listing = new Listing(req.body.listing)
    await listing.save();
    res.redirect("/listings");
}));




router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
module.exports = router;