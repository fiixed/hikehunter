const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Hike = require('../models/hike');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/hikehunter', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Hike.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const difficulty = Math.floor(Math.random() * 5) + 1;
        const hike = new Hike({
            author: '640c944cfd8a04be2b66d09f',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/fiixed/image/upload/v1678732715/HikeHunter/riwbcoqhtpahyj0zbw1u.jpg',
                    filename: 'HikeHunter/riwbcoqhtpahyj0zbw1u'

                },
                {
                    url: 'https://res.cloudinary.com/fiixed/image/upload/v1678732715/HikeHunter/b8fvndggnmntqxuzeuyz.jpg',
                    filename: 'HikeHunter/b8fvndggnmntqxuzeuyz'
                },
                {
                    url: 'https://res.cloudinary.com/fiixed/image/upload/v1678732715/HikeHunter/dwv6hmj7jr27kqmrfiw9.jpg',
                    filename: 'HikeHunter/dwv6hmj7jr27kqmrfiw9'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            difficulty
        })
        await hike.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})