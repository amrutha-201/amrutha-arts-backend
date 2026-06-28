const mongoose=require("mongoose");
const orderSchema=new mongoose.Schema({
    name:String,
    mail:String,
    phoneNumber:String,
    medium:String,
    size:String,
    frame:String,
    specifications:String,
    photo:String,
    status:{
        type:String,
        default:"Pending"
    }
});
module.exports=mongoose.model("Order",orderSchema);