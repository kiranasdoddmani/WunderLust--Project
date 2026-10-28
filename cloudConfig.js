const cloudinary = require("cloudinary").v2;
const { config } = require("dotenv");
const { CloudinaryStorage } = require("multer-storage-cloudinary-v2");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

module.exports={
   cloudinary,
    storage
};