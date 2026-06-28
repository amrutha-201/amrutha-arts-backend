const mongoose=require("mongoose");
const PaintingOrderSchema=new mongoose.Schema({
    customerName:String,
    email:String,
    phoneNumber:String,
    address:String,
    items:Array,
    status:{
        type:String,
        default:"Pending"
    },
    orderType:{
        type:String,
        default:"Painting"
    }
});
module.exports=mongoose.model(
    "PaintingOrder",
    PaintingOrderSchema
)
