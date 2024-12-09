let mongoose = require("mongoose");
let Listing = require("../models/listing.js");

let initData = require("./data.js");

main()
.then(()=>{
    console.log("connected to database");
}).catch(err =>{
    console.log(err);
})
async function main(){
    await 
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

let dataDb = async () =>{
   await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log(initData.data);
};

dataDb();

