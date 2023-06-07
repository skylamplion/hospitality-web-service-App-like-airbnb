require('dotenv').config({path:"./.env"});
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");
const multer = require("multer");
const bcrypt = require("bcrypt");
const auth = require("./src/middlewares/auth");
const cors = require("cors");
const cloudinary = require("cloudinary"); // importing cloudinary library:
const Datauri = require("datauri/parser");


const {User, Property, Booking, Rating, Contact, Favourite} = require("./src/models/collections");
const { log } = require("console");
const { Schema } = require('mongoose');
require("./src/db/connection");
require("./configs/cloudinaryConfig");


//creating PORT::
const PORT = process.env.PORT || 3000;

//creating app instance::
const app = express();


//defining paths::
const static_path = path.join(__dirname, "./public");
const views_path = path.join(__dirname, "./templates/views");
const partials_path = path.join(__dirname, "./templates/partials");

//using middlewares::
app.use(express.static(static_path));
app.use(cookieParser());
app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);    
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({"origin": "*"}));


//datauri configuration part::

const image_encoded = new Datauri();
// console.log(image_encoded);
const imageEncodingFunc = (image)=>{
    console.log(image);
    return image_encoded.format(path.extname(image.originalname).toString(), image.buffer);

}

//routing::
app.get("", async(req, res)=>{
    try {

        if (req.cookies.jwt && jwt.verify(req.cookies.jwt, process.env.SECRET_KEY)){
            res.redirect("/dashboard");
        }else{
            res.render("index")
        }   
    } catch (error) {
        console.log(error);
    }
    
})

app.get("/register", (req, res)=>{
    res.render("register");
})


//SETTING UP MULTER FOR STROING profile IMAGES::
// const storage = multer.memoryStorage({
    // destination: function(req, file, cb){
    //     cb(null, "./images");
    // },
    // filename:function(req, file, cb){
    //     console.log(file);
    //     cb(null, Date.now() + path.extname(file.originalname));
    // }
// });

// function filter(req, file, cb){

// }

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    // fileFilter: filter
});

app.post("/register", upload.single("profile_picture"), async (req, res)=>{

    try {
        console.log(req.file);
        const file = await imageEncodingFunc(req.file).content  ;
        console.log("this is the file - ",file);
        // console.log("this is the new datauri object - ", image_encoded);

        const result = await cloudinary.v2.uploader.upload(file);
        const imageurl = result.url;

        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;

        let seqId = 0; // generating our seqId as 0 and we will update this according to the number of users in our database
        if (password === confirmPassword){
            
            //User is my user who registers model name
            if ((await User.count({})) == 0){
                seqId = 1;
            }else{
                let userId = await User.findOne().sort("-_id"); //finding the number of users available and sorting thwem and "-_id" represents that i want the id of the last user
                seqId = userId.user_id + 1;//now we are incrementing the id of the user by one from the id of the last user
            }
            
            //saving the data into the database
            const registration = new User({
                user_id: seqId, //updating the user_id with our "seqId" that we created using the counter method above
                user_type: req.body.user_type,
                firstName: req.body.firstname,
                lastName: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                password: password,
                confirm_password: confirmPassword,
                contact: req.body.contact,
                dateOfBirth: req.body.dob,
                city: req.body.city,
                country: req.body.country,
                profile_picture: imageurl
            })

            //hashing the password using bcrypt

            const securePass = await bcrypt.hash(password, 10);
            registration.password = securePass;
            registration.confirm_password = undefined;
            await registration.save();
            res.render("login");

        }else{
            res.send("Your passwords did not match")
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/dashboard", auth, async(req, res)=>{
    const userData = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
    const name = await User.findOne({user_id: userData.user_id}, {firstName:1, _id:0});

    res.render("userdashboard", {
        name: name.firstName
    });
});

app.post("/login", async(req, res)=>{
    try {
        let token;
        const useremail = req.body.email;
        const password = req.body.password;
        
        const email = await User.findOne({email: useremail});

        if (email){

            //checking if the entered pass matches with the hashed password::
            const matchPass = await bcrypt.compare(password, email.password);

            if (matchPass === true){
                token = await email.generateAuthToken();
                //saving jwt in cookies::
                res.cookie("jwt", token, {
                    httpOnly: true
                });

                res.status(201).redirect("/dashboard");
                // res.redirect("/index/:id");
            }else{
                res.status(400).redirect("/invalidCred")
            }
        }else{
            res.status(400).redirect("/invalidCred")
        }
    } catch (error) {
        res.status(400).res.status(500).redirect("/invalidCred")
    }
});

app.get("/hosting", auth, async(req, res)=>{
    const userData = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
    const name = await User.findOne({user_id: userData.user_id}, {firstName:1, user_type:1, _id:0});

    if (name.user_type=="guest"){
        res.status(200).redirect("/");
    }else{
        res.status(200).render("hosting", {
            name:name.firstName
        });
    }
});




app.post("/hosting", upload.array("galleryimages"), async(req, res)=>{
    try {

        let seqId = 0; // generating our seqId as 0 and we will update this according to the number of users in our database

        //User is my user who registers model name
        if ((await Property.count({})) == 0){
            seqId = 1;
        }else{
            let propId = await Property.findOne().sort("-_id"); //finding the number of users available and sorting thwem and "-_id" represents that i want the id of the last user
            seqId = propId.property_id + 1;//now we are incrementing the id of the user by one from the id of the last property
        }
    
        const mycookie = req.cookies.jwt;
        const data = await jwt.verify(mycookie, process.env.SECRET_KEY);

        //setting the uploaded images in an array::
        let imageArr = [];
        req.files.forEach(async (img) => {
            const file = await imageEncodingFunc(img).content  ;

            const result = await cloudinary.v2.uploader.upload(file);
            const imageurl = result.url;
            imageArr.push(imageurl);

            if (imageArr.length === req.files.length){
                const property_registration = new Property({
                    property_id: seqId,
                    user_id: data.user_id,
                    property_type: req.body.property_type,
                    property_name: req.body.property_name,
                    owner_name: req.body.owner,
                    property_details:{
                        city: req.body.city,
                        state: req.body.state,
                        country: req.body.country
                    },
                    price: req.body.price,
                    area: req.body.area,
                    rating: req.body.rating,
                    images: imageArr,
                    bedrooms: req.body.bedrooms,
                    beds: req.body.beds,
                    guests_allowed: req.body.guest_allowed,
                    description: req.body.textarea,
                    amenities:{
                        parking: req.body.parking,
                        wifi: req.body.wifi,
                        breakfast: req.body.breakfast,
                        ac: req.body.ac,
                        laundry: req.body.laundry,
                        fridge: req.body.fridge,
                        kitchen: req.body.kitchen,
                        smoke_alarm: req.body.smoke_alarm,
                        pets_allowed: req.body.pets_allowed,
                    }
                });
                const propertyregistered = await property_registration.save();
                res.status(200).redirect("/hostedproperties");
            }
        });

    } catch (error) {
        console.log(error);
    }
});


//route for hoelbooking page::

app.get("/hotelBooking", auth, async(req, res)=>{
    const userData = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);

    const name = await User.findOne({user_id: userData.user_id}, {firstName:1, _id:0});

    res.status(200).render("bookingHotel", {
        name: name.firstName
    });
});

app.post("/hotelBooking", auth, async(req, res)=>{
    try {
        let seqId = 0; // generating our seqId as 0 and we will update this according to the number of users in our database

        //User is my user who registers model name
        if ((await Booking.count({})) === 0){
            seqId = 1;
        }else{
            let bookingId = await Booking.findOne().sort("-_id"); 
            seqId = bookingId.booking_id + 1;//now we are incrementing the id of the user by one from the id of the last property
        };

        const mycookie = req.cookies.jwt;
        let data = jwt.verify(mycookie, process.env.SECRET_KEY);

        const booking = new Booking({
            booking_id: seqId,
            user_id: data.user_id,
            property_id: req.body.prop_id,
            checkIn_date: req.body.check_in_date,
            checkOut_date: req.body.check_out_date,
            total_price: req.body.total_price,
            payment_mode: req.body.payment_mode,
            number_of_nights:req.body.rooms_count
        })
    
        await booking.save();
        res.status(200).render("bookingHotel");
    } catch (error) {
        console.log(error);
    }
});


app.get("/myprofile", auth, async(req, res)=>{
    const mycookie = req.cookies.jwt;
    const myinfo = jwt.verify(mycookie, process.env.SECRET_KEY);

    let mydata = await User.findOne({user_id: myinfo.user_id});


    res.status(200).render("myprofile", {
        firstname: mydata.firstName,
        lastname: mydata.lastName,
        email: mydata.email,
        contact: mydata.contact,
        name: mydata.firstName
    });
});


app.post("/myprofile", auth, async(req, res)=>{
    try {
        const mycookie = req.cookies.jwt;
        const myinfo = jwt.verify(mycookie, process.env.SECRET_KEY);

        let mydata = await User.findOne({user_id: myinfo.user_id});
    
        const updated = await User.findOneAndUpdate({user_id: myinfo.user_id}, {
            $set: {
                    
                    firstName: req.body.firstname,
                    lastName: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password || mydata.password,             
                    contact: req.body.contact,
            }
        });


        //hashing the pass::
        const securePass = await bcrypt.hash(req.body.password, 10);
        updated.password = securePass;

        await updated.save();
        res.redirect("/myprofile");
    } catch (error) {
        console.log(error);
    }
});


app.get("/deleteuser", async(req, res)=>{
    try {
        const mycookie = req.cookies.jwt;
        const myinfo = jwt.verify(mycookie, process.env.SECRET_KEY);

        await User.findOneAndDelete({user_id: myinfo.user_id});
        await Property.deleteMany({user_id: myinfo.user_id});
        await Booking.deleteMany({user_id: myinfo.user_id});
        await Rating.deleteMany({user_id: myinfo.user_id});
        await Favourite.deleteMany({user_id: myinfo.user_id});

        res.clearCookie("jwt");
        res.status(200).redirect("/");

    } catch (error) {
        console.log(error);
    };
});





//MY BOOKINGS PAGE ROUTE::

app.get("/mybookingspage", auth, async(req, res)=>{
    const userData = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
    const name = await User.findOne({user_id: userData.user_id}, {firstName:1, _id:0});

    res.status(200).render("mybookingspage", {
        name: name.firstName
    });
});


app.post("/mybookingspage", auth, async(req, res)=>{
    try {
        const userData = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);

        let seqId = 0; // generating our seqId as 0 and we will update this according to the number of users in our database

        //User is my user who registers model name
        if ((await Rating.count({})) === 0){
            seqId = 1;
        }else{
            let ratingId = await Rating.findOne().sort("-_id"); 
            seqId = ratingId.rating_id + 1;//now we are incrementing the id of the user by one from the id of the last property
        };

        const user = await User.findOne({user_id:userData.user_id}, {firstName:1, profile_picture:1, _id:0});

        console.log("hello",user);

        const rated = new Rating({
            rating_id: seqId,
            user_id: userData.user_id,
            user_name: user.firstName,
            profile_picture: user.profile_picture,
            property_id: req.body.propId,
            rating: req.body.rated,
            review_description: req.body.review_of_prop,
        });

        await rated.save();
        res.status(200).redirect("/mybookingspage")

    } catch (error) {
        console.log(error);
    } 
})


app.get("/hostedproperties", auth, async(req, res)=>{
    const userData = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);


    const name = await User.findOne({user_id: userData.user_id}, {firstName:1, user_type:1 ,_id:0});

    if (name.user_type == "guest"){
        res.status(200).redirect("/");
    }else{
        res.status(200).render("hostedproperties", {
            name: name.firstName
        });
    }

    
});


app.get("/delProp/:id", auth, async (req, res)=>{
    const user = await jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);

    const del = await Property.findOneAndDelete({user_id: user.user_id, property_id: req.params.id});

    await Favourite.deleteMany({property_id: req.params.id});
    await Booking.deleteMany({property_id: req.params.id});

    res.status(200).redirect("/hostedproperties");
});



app.get("/contactUs", (req, res)=>{
    res.status(200).render("contactus");
});


app.get("/logout", (req,res)=>{

    res.clearCookie("jwt");
    res.status(200).render("login");
});




// console.log(`${__dirname} ../images/gallery`);
app.get("/getImages/:id", (req, res)=>{

    // res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(__dirname + `/images/${req.params.id}`);
})


//creating api to fetch our hotel data at the front-end::

app.get("/fetchall", (req, res)=>{
    Property.find({}, (err, result)=>{
        if (err){
            // res.send(err);
            console.log(err);
        }else{
            console.log(result);
            res.send(result);
        }
    });
});

//ceating api to fetch our user data::

app.get("/fetchuser", auth, async(req, res)=>{

    const myCookie = req.cookies;
    let data = jwt.verify(myCookie.jwt, process.env.SECRET_KEY);

    let userlogged = await User.find({user_id: data.user_id});

    // sending req data to frontend::
    userlogged = [{
        "user_id": userlogged[0].user_id,
        "user_image": userlogged[0].profile_picture,
        "user_type": userlogged[0].user_type
    }];
    console.log(userlogged);
    res.status(200).send(userlogged);
});


//fetching bookings data::

app.get("/fetchbookings", auth, async(req, res)=>{
    try {
        const mycookie = req.cookies.jwt;
        let data = jwt.verify(mycookie, process.env.SECRET_KEY);

        const bookings = await Booking.find({user_id: data.user_id});

        res.status(200).send(bookings);
    } catch (error) {
        console.log(error);
    }
});


app.get("/fetchhostings", auth, async(req, res)=>{
    try {
        const mycookie = req.cookies.jwt;
        let data = jwt.verify(mycookie, process.env.SECRET_KEY);

        const hostings = await Property.find({user_id: data.user_id});


        res.status(200).send(hostings);
    } catch (error) {
        console.log(error);
    }
});

app.get("/ratings", async(req, res)=>{
    try {
        const data = await Rating.find({});

        res.send(data);
    } catch (error) {
        console.log(error);
    }
});

app.get("/delBookings/:id", auth, async(req, res)=>{
    try {
        const token = req.cookies.jwt;
        const user = await jwt.verify(token, process.env.SECRET_KEY);

        await Booking.findOneAndDelete({user_id: user.user_id, booking_id: req.params.id});
        res.status(200).end();
    } catch (error) {
        console.log(error);
    }
});


//MY FAV PAGE RENDER::

app.get("/myFavourites", auth, (req, res)=>{
    res.status(200).render("myFav");
})

app.post("/myFavourites", auth, async(req, res)=>{
    try {
        
        const mytoken = req.cookies.jwt;
        const user = await jwt.verify(mytoken, process.env.SECRET_KEY);

        let seqId = 0; 

        //User is my user who registers model name
        if ((await Favourite.count({})) === 0){
            seqId = 1;
        }else{
            let favId = await Favourite.findOne().sort("-_id"); 
            seqId = favId.fav_id + 1;
        };
        console.log(req.body.prop_id);

        const favouriteData = new Favourite({
            fav_id: seqId,
            user_id: user.user_id,
            property_id: req.body.prop_id,
            title: req.body.title
        });

        await favouriteData.save();

        res.status(200).redirect("/dashboard");

    } catch (error) {
        console.log(error);
    }

});


app.get("/fetchMyFav", auth, async(req, res)=>{
    try {
        const myToken = req.cookies.jwt;
        const user = await jwt.verify(myToken, process.env.SECRET_KEY);
        
        const whishlistData = await Favourite.find({user_id: user.user_id});

        console.log(whishlistData);

        res.status(200).send(whishlistData);
    } catch (error) {
        res.send(400).send({"message": error});
    }
});

app.get("/delmyFav/:id", auth, async(req, res)=>{
    try {
        
        const mytoken = req.cookies.jwt;
        const user = await jwt.verify(mytoken, process.env.SECRET_KEY);

        await Favourite.findOneAndDelete({property_id: req.params.id, user_id: user.user_id});

        res.status(200).end();

    } catch (error) {
        res.status(400).send({"message" : error});
    }
});

app.get("/delmyFavourite/:id", auth, async(req, res)=>{
    try {
        
        const mytoken = req.cookies.jwt;    
        const user = await jwt.verify(mytoken, process.env.SECRET_KEY);

        await Favourite.findOneAndDelete({property_id: req.params.id, user_id: user.user_id});

        res.status(200).redirect("/myFavourites");

    } catch (error) {
        res.status(400).send({"message" : error});
    }
});


app.get("/error", async(req, res)=>{

    if(req.cookies.jwt != null || req.cookies.jwt != undefined){
        res.status(200).redirect("/");
    }else{
        res.status(200).render("error");
    }

});

app.get("/invalidCred", (req, res)=>{

    if(req.cookies.jwt != null || req.cookies.jwt != undefined){
        res.status(200).redirect("/");
    }else{
        res.status(500).render("invalidC");   
    }
});



//listening to the server::
app.listen(PORT, ()=>{
    console.log(`started at ${PORT}`);
});