let express = require("express");
let router = express.Router({mergeParams:true}); 
let {listingSchema , reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/async.js");
const experr = require("../utils/experr.js");
let Listing = require("../models/listing.js");
let review = require("../models/review.js");


const validationListings=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new experr(404,error);
    }
    else{
        next();
    }
    }

let reviewValidation = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new experr(404,error);
    }
    else{
        next();
    }
}




router.post(
    "/",reviewValidation,wrapAsync(async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    listings.reviews.push(newReview);

   await listings.save();
  await  newReview.save();
 
    res.redirect(`/listings/${listings._id}`);
}))

router.delete("/:revid",wrapAsync(async(req,res,next)=>{

    let {id, revid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews:revid}})

    await review.findByIdAndDelete(revid);
    res.redirect(`/listings/${id}`);


}))
module.exports = router;