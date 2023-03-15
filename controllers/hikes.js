const Hike = require('../models/hike');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const hikes = await Hike.find({});
    res.render('hikes/index', { hikes })
}

module.exports.renderNewForm = (req, res) => {
    res.render('hikes/new');
}

module.exports.createhike = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hike.location,
        limit: 1
    }).send()
    const hike = new Hike(req.body.hike);
    hike.geometry = geoData.body.features[0].geometry;
    hike.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hike.author = req.user._id;
    await hike.save();
    console.log(hike);
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
    console.log(req.body);
    const hike = await Hike.findByIdAndUpdate(id, { ...req.body.hike });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    hike.images.push(...imgs);
    await hike.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);  // delete on cloudinary
        }
        await hike.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })  // delete on Mongo
    }
    req.flash('success', 'Successfully updated hike!');
    res.redirect(`/hikes/${hike._id}`)
}

module.exports.deleteHike = async (req, res) => {
    const { id } = req.params;
    await Hike.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hike')
    res.redirect('/hikes');
}