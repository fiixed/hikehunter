const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { hikeSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');
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
router.get('/new', isLoggedIn, (req, res) => {
    res.render('hikes/new');
});

router.post('/', validateHike, catchAsync(async (req, res, next) => {
    const hike = new Hike(req.body.hike);
    await hike.save();
    req.flash('success', 'Successfully made a new hike!');
    res.redirect(`/hikes/${hike._id}`);
}));

router.get('/:id', catchAsync(async (req, res,) => {
    const hike = await Hike.findById(req.params.id).populate('reviews');
    if (!hike) {
        req.flash('error', 'Cannot find that hike!');
        return res.redirect('/hikes');
    }
    res.render('hikes/details', { hike }, );
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const hike = await Hike.findById(req.params.id)
    if (!hike) {
        req.flash('error', 'Cannot find that hike!');
        return res.redirect('/hikes');
    }
    res.render('hikes/edit', { hike });
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hike = await Hike.findByIdAndUpdate(id, { ...req.body.hike });
    req.flash('success', 'Successfully updated hike!');
    res.redirect(`/hikes/${hike._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Hike.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hike')
    res.redirect('/hikes');
}))

module.exports = router;