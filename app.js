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
const experr = require("./utils/experr.js");
let listings = require("./routes/listings.js");
let revlistings = require("./routes/review.js");
let review = require("./models/review.js");
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
app.use("/listings/:id/review",revlistings);
app.use("/listings",listings);




app.all("*",(req,res,next)=>{
    next(new experr(401,"page not found"));
})

app.use((err,req,res,next)=>{
    let{status=500,message="something wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
})



