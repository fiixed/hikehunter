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

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/makehike', async (req, res) => {
    const hike = new Hike({title: 'My alley way', description: 'Test'});
    await hike.save();
    res.send(hike);
});

app.listen(3000, () => {
    console.log(`Server started on 3000`);
});