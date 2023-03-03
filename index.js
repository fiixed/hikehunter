const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Hike = require('./models/hike');

mongoose.connect('mongodb://localhost:27017/hikehunter',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/hikes', async (req, res) => {
    const hikes = await Hike.find({});
    res.render('hikes/index', { hikes });
});
app.get('/hikes/new', (req, res) => {
    res.render('hikes/new');
});

app.get('/hikes/:id', async (req, res,) => {
    const hike = await Hike.findById(req.params.id)
    res.render('hikes/details', { hike });
});

app.post('/hikes', async (req, res) => {
    const hike = new Hike(req.body.hike);
    await hike.save();
    res.redirect(`/hikes/${hike._id}`);
});



app.listen(3000, () => {
    console.log(`Server started on 3000`);
});