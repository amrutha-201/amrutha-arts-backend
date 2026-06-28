const mongoose=require("mongoose");
const artworkSchema=new mongoose.Schema({
    id:Number,
    title:String,
    medium:String,
    price:Number,
    image:String,
    description:String,
    availability:{
        type:Boolean,
        default:true
    }
})
module.exports=mongoose.model("Artwork",artworkSchema)