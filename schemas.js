const Joi = require('joi');

module.exports.hikeSchema = Joi.object({
    hike: Joi.object({
        title: Joi.string().required(),
        difficulty: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});