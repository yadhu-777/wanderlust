let joi = require("joi");



module.exports.listingSchema = joi.object({
    listing: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().allow("",null),
        price:joi.number().required().min(0),
        country:joi.string().required(),
        location:joi.string().required()
    })
})

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
})