require("dotenv").config();
const mongoose = require("mongoose");
const Artwork = require("./models/Artwork");
const artworks = require("./data/artworks");
mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
console.log("MongoDB Connected");
await Artwork.deleteMany();
await Artwork.insertMany(artworks);
console.log("Artworks Imported Successfully");
process.exit();
})
.catch((err) => {
console.log(err);
process.exit(1);
});
