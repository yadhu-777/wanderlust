let mongoose = require("mongoose");
let express = require("express");
let app = express();
let path = require("path");
let ejsMate = require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
var methodOverride = require('method-override')
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const wrapAsync = require("./utils/async.js");
const experr = require("./utils/experr.js");
let {listingSchema , reviewschema} = require("./schema.js");
let Listing = require("./models/listing.js");
const { Console, error } = require("console");
let review = require("./models/review.js")
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

app.listen(3000,()=>{
    console.log("server started");
});

app.get("/",(req,res)=>{
    res.send("working");
});

// app.get("/listing",async (req,res)=>{
//     let list = new Listing({
//         title:"yadhu",
//         description:"hui my fellows",
//         price:888,
//         location:"jss nagar",
//         country:"india"
//     })
//     await list.save().then(()=>{
//         console.log("saved");
//     })
    
// })


const validationListings=(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new experr(404,error)
    }
    else{
        next();
    }
    }

let reviewValidation = (req,res,next) =>{
    let {error} = reviewschema.validate(req.body);
    if(error){
        throw new experr(404,error);
    }else{
        next();
    }
}



app.post("/listings/:id/review",reviewValidation(async(req,res)=>{
    let listings = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    listings.reviews.push(newReview);

   await listings.save();
  await  newReview.save();
 
    res.redirect(`/listings/${listings._id}`);
}))




app.get("/listings",wrapAsync(async (req,res)=>{
    let data = await Listing.find();
    res.render("./listings/index.ejs",{data});

}));
app.get("/listings/:id/edit",validationListings, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let ditData = await Listing.findById(id);
    res.render("listings/edit.ejs",{ditData});
   
}));
//cerate
app.get("/listings/new",(req,res)=>{
    res.render("listings/view.ejs");
})

app.put("/listings/:id",validationListings,wrapAsync(async (req,res,next)=>{
   
        let {id} = req.params;
await Listing.findByIdAndUpdate(id,{...  req.body.edit},{runValidators:true},{new:true})
    res.redirect(`/listings/${id}`);
 
}));



app.post("/listings",validationListings,wrapAsync(async (req,res,next)=>{

        let listing = new Listing(req.body.listing)
    await listing.save();
    res.redirect("/listings");
}));



app.get("/listings/:id",wrapAsync(async (req,res)=>{

    let {id} = req.params;
    let showData = await Listing.findById(id);
    res.render("listings/show.ejs",{showData});
    

}));
app.delete("/listings/:id",wrapAsync( async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
app.all("*",(req,res,next)=>{
    next(new experr(401,"page not found"));
})

app.use((err,req,res,next)=>{
    let{status=500,message="something wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
})



