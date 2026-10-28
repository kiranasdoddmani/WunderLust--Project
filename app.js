require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express=require("express");
const app=express();

const port=8080;

const mongoose = require('mongoose');
const Listening=require('./models/listings.js');

const path = require("path");
const methodOverride = require("method-override");
const WrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review =require("./models/review.js");

const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const user=require("./routes/router.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const ejsmate=require('ejs-mate');
app.engine("ejs",ejsmate);

app.use(express.static(path.join(__dirname,"public")));

const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));

const session = require('express-session');
const MongoStore = require("connect-mongo").default;

  const flash = require("connect-flash");
  const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl=process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

  const SessionOptions={
    store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }};

   app.use(session(SessionOptions));
   app.use(flash());

   app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


   app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// const MANGO_UTL="mongodb://127.0.0.1:27017/wunderLust";



main().then((res)=>{
    console.log("Connected SuccessFully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//     res.send("Hi, I am Root");
// })


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);


// Error-MiddleWare
app.use((err,req,res,next)=>{
    let{statusCode=500,message="SomeThing Went-Wrong"}=err;
 //   res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message})
})

// For All
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page is Not Found"));
});

// 404 Middleware — must come after all valid routes
// app.all("/{*splat}", (req, res, next) => {
//     next(new ExpressError(404, "Page is Not Found"));
// });

// // Error Middleware — must come last
// app.use((err, req, res, next) => {
//     let {
//         statusCode = 500,
//         message = "Something Went Wrong"
//     } = err;

//     res.status(statusCode).render("error.ejs", { message });
// });
app.listen(port,(req,res)=>{
    console.log(`app listening port ${port}`);
})