const express = require('express');
const router = express.Router();
const hikes = require('../controllers/hikes');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHike } = require('../middleware');

const Hike = require('../models/hike');

router.route('/')
    .get(catchAsync(hikes.index))
    .post(isLoggedIn, validateHike, catchAsync(hikes.createhike))

router.get('/new', isLoggedIn, hikes.renderNewForm)

router.route('/:id')
    .get(catchAsync(hikes.showHike))
    .put(isLoggedIn, isAuthor, validateHike, catchAsync(hikes.updateHike))
    .delete(isLoggedIn, isAuthor, catchAsync(hikes.deletehike));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hikes.renderEditForm))



module.exports = router;