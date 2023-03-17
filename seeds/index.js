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
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const difficulty = Math.floor(Math.random() * 5) + 1;
        const hike = new Hike({
            //YOUR USER ID
            author: '640c944cfd8a04be2b66d09f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            difficulty,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://source.unsplash.com/random/?hiking',
                    filename: 'hikehunter/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://source.unsplash.com/random/?camping',
                    filename: 'hikehunter/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })
        await hike.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})