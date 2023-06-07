require('dotenv').config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



//defining Schemas::
const userRegistrationSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        unique: true
    },
    user_type: {
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    confirm_password:{
        type: String,
        // required: true,
    },

    contact:{
        type: Number,
        unique: true,
        required: true,
    },
    dateOfBirth:{
        type: Date,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    profile_picture:{
        type: String,
        required: true
    }, 
    tokens:[
        {
            token:{
                type: String,
                required: true,
            }
        },
    ]
});




const propertySchema = new mongoose.Schema({
    property_id: {
        type: Number,
        unique: true
    },
    property_type:{
        type: String,
        lowercase: true
    },
    user_id:{
        type: Number,
        required: true
    },
    property_name:{
        type: String,
        required: true,
    },
    owner_name:{
        type: String,
        required: true,
    },
    property_details: {
        city: String,
        state: String,
        country: String
    },
    price:{
        type: Number,
        required: true,
    },
    area:{
        type:Number,
        required: false
    },
    rating:{
        type: String,
    },
    images:{
        type: [String],
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    guests_allowed:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    amenities: {
        parking:{
            type: String,
            required: true
        },
        wifi: {
            type: String,
            required: true
        },
        breakfast: {
            type: String,
            required: true
        },
        ac: {
            type: String,
            required: true
        },
        laundry: {
            type: String,
            required: true
        },
        fridge: {
            type: String,
            required: true
        },
        kitchen: {
            type: String,
            required: true
        },
        pets_allowed: {
            type: String,
            required: true
        },
        smoke_alarm: {
            type: String,
            required: true
        },
    }
});


const bookingSchema = new mongoose.Schema({
    booking_id: {
        type: Number,
        unique: true
    },
    booking_date: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: Number,
        required: true
    },
    property_id: {
        type: Number,
        required: true
    },
    checkIn_date: {
        type: Date,
        required: true
    },
    checkOut_date: {
        type: Date,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    payment_mode: {
        type: String,
    },
    number_of_nights: {
        type: Number,
        required: true
    }
});


const ratingSchema = new mongoose.Schema({
    rating_id: {
        type: Number,
        unique: true
    },
    rating:{
        type: Number,
        required: true
    },
    user_id: {
        type: Number,
        required: true
    },
    user_name:{
        type: String,
        required: true
    }, 
    profile_picture:{
        type: String,
        required: true
    },
    property_id: {
        type: String,
        required: true
    },
    rating_date: {
        type: Number, 
        default: Date.now()
    },
    review_description: {
        type: String,
    }
});


const contactSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: false
    }
});


const myFavouritesSchema = new mongoose.Schema({
    fav_id:{
        type:Number,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    property_id:{
        type: String,
        required: true
    },
    title:{
        type: String
    }
})

userRegistrationSchema.methods.generateAuthToken = async function (){
    try {

        let mytoken = jwt.sign({user_id: this.user_id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: mytoken});
        await this.save();
        return mytoken;
    } catch (error) {
        console.log(err);
    }
}


//Creating Collections::
const User = new mongoose.model("user", userRegistrationSchema);
const Property = new mongoose.model("property", propertySchema);
const Booking = new mongoose.model("booking", bookingSchema);
const Rating = new mongoose.model("rating", ratingSchema);
const Contact = new mongoose.model("contact", contactSchema);
const Favourite = new mongoose.model("favourite", myFavouritesSchema);




//exporting the collections::
module.exports = {User, Property, Booking, Rating, Contact, Favourite};