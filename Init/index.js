const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wunderLust");
    console.log("Connected Successfully");
}

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "652d0081ae547c5d37e56b5f",
    }));

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

main()
    .then(initDB)
    .then(() => {
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });

    initDB();