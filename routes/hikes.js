const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { hikeSchema } = require('../schemas');
const Hike = require('../models/hike');

const validateHike = (req, res, next) => {
    const { error } = hikeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const hikes = await Hike.find({});
    res.render('hikes/index', { hikes });
}));
router.get('/new', (req, res) => {
    res.render('hikes/new');
});

router.post('/', validateHike, catchAsync(async (req, res) => {

    const hike = new Hike(req.body.hike);
    await hike.save();
    res.redirect(`/hikes/${hike._id}`);
}));

router.get('/:id', catchAsync(async (req, res,) => {
    const hike = await Hike.findById(req.params.id).populate('reviews');
    res.render('hikes/details', { hike });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const hike = await Hike.findById(req.params.id)
    res.render('hikes/edit', { hike });
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body.hike);
    const hike = await Hike.findByIdAndUpdate(id, { ...req.body.hike });
    res.redirect(`/hikes/${hike._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Hike.findByIdAndDelete(id);
    res.redirect('/hikes');
}))

module.exports = router;