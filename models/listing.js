let mongoose = require("mongoose");
const review = require("./review.js");

let Schema = mongoose.Schema;


let listingSchema = new Schema({
    title:{
        type:String,
        required:true

    },
    description:{
        type:String
    },
    image:{ 
      filename:{type :String},
      url:{type:String,default:"https://images.unsplash.com/photo-1723913497367-03ea2b196858?q=80&w=1908&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set :(v) => v === "" ? "default" : v
      } 
    },
    price:{
        type:Number
    },
    location:{
        type:String 
    },
    country:{
        type:String
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"review"
        }
    ]

})
let listing = mongoose.model("listing",listingSchema);

module.exports = listing;

