const Hike = require('../models/hike');

module.exports.index = async (req, res) => {
    const hikes = await Hike.find({});
    res.render('hikes/index', { hikes })
}

module.exports.renderNewForm = (req, res) => {
    res.render('hikes/new');
}

module.exports.createhike = async (req, res, next) => {
    const hike = new Hike(req.body.hike);
    hike.author = req.user._id;
    await hike.save();
    req.flash('success', 'Successfully made a new hike!');
    res.redirect(`/hikes/${hike._id}`)
}

module.exports.showHike = async (req, res,) => {
    const hike = await Hike.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!hike) {
        req.flash('error', 'Cannot find that hike!');
        return res.redirect('/hikes');
    }
    res.render('hikes/details', { hike });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const hike = await Hike.findById(id)
    if (!hike) {
        req.flash('error', 'Cannot find that hike!');
        return res.redirect('/hikes');
    }
    res.render('hikes/edit', { hike });
}

module.exports.updateHike = async (req, res) => {
    const { id } = req.params;
    const hike = await Hike.findByIdAndUpdate(id, { ...req.body.hike });
    req.flash('success', 'Successfully updated hike!');
    res.redirect(`/hikes/${hike._id}`)
}

module.exports.deleteHike = async (req, res) => {
    const { id } = req.params;
    await Hike.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hike')
    res.redirect('/hikes');
}