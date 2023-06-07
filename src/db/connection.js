require('dotenv').config();
const mongoose = require('mongoose');

const DB = process.env.DATABASE;

//making connection::
mongoose.connect(DB, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex: true
}).then(()=>{
    console.log(`connection successful`);
}).catch(err => console.log(err));
