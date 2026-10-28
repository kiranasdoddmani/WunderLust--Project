const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review.js')
// main()
//   .then(() => {
//     console.log("Connected Successfully");
//   })
//   .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wunderLust');
// }


// Schema
const ListeningSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String
  },
  price: {
  type: Number,
  required: true,
   min: [0, "Price cannot be negative!"]
},
  location: String,
  country: String,
  reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
],
owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
},
geometry: {
    type: {
        type: String,
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}
});


ListeningSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});


// Model
const Listening = mongoose.model('Listening', ListeningSchema, 'listings');

module.exports = Listening;



// Set

// show dbs
// use 
//  show collections
//  db.listening.find()