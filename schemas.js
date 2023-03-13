const Joi = require('joi');

module.exports.hikeSchema = Joi.object({
    hike: Joi.object({
        title: Joi.string().required(),
        difficulty: Joi.number().required().min(1).max(5),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})