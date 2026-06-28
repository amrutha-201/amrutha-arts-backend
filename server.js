require("dotenv").config();
const mongoose=require("mongoose");
const express = require("express");
const cors = require("cors");
const Artwork=require("./models/Artwork")
const app = express();
const multer=require("multer");
const path=require("path");
const Order=require("./models/Order");
const PaintingOrder=require("./models/PaintingOrder")
const storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(
            null,
            Date.now()+path.extname(file.originalname)
        );
    }
});
const upload=multer({storage})
app.use(cors());
app.use(express.json());
app.use(
    "/paintings",
    express.static(path.join(__dirname,"data","paintings"))
);
app.use(
    "/uploads",
    express.static(path.join(__dirname,"uploads"))
);
app.get("/", (req, res) => {
  res.send("Amrutha Arts Backend Running");
});
app.post("/customorders",upload.single("photo"),async(req,res)=>{
    try{
    const order={
        ...req.body,
        photo:req.file?req.file.filename:null
    };
    await Order.create(order);
    res.status(201).json({
        message:"Order submmitted successfully"
    });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error saving order" 
        });
    }
});
app.get("/customorders",async(req,res)=>{
    try{
        const orders=await Order.find();
        res.json(orders);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error fetching orders"
        });
    }
});
app.delete("/customorders/:id",async(req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.json({
            message:"order deletec successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error deleting order"
        });
    }
});
app.put("/customorders/:id",async(req,res)=>{
    try{
        const updatedOrder=await Order.findByIdAndUpdate(
            req.params.id,
            {status:req.body.status},
            {new:true}
        );
        res.json(updatedOrder);

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error updating order"
        })
    }
})
console.log("Mongo_uri=",process.env.MONGO_URI);
mongoose
    .connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000
    })
    .then(()=>{
        console.log("MongoDB Connected");
    })
    .catch((err)=>{
        console.log(err);
    })
app.post("/paintingorders", async (req, res) => {
  try {
    const order = await PaintingOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error saving painting order"
    });
  }
});
app.get("/paintingorders", async (req, res) => {
  try {
    const orders = await PaintingOrder.find();
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching painting orders"
    });
  }
});
app.delete("/paintingorders/:id", async (req, res) => {
  try {
    await PaintingOrder.findByIdAndDelete(req.params.id);
    res.json({
      message: "Painting order deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting painting order"
    });
  }
});
app.get("/artworks",async(req,res)=>{
    try{
        const artworks=await Artwork.find();
        res.json(artworks);
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error fetching artwork"
        })
    }
})
app.put("/artworks/:id",async(req,res)=>{
    try{
        const artwork= await Artwork.findByIdAndUpdate(
            req.params.id,
            {availability:req.body.availability},
            {new:true}
        );
        res.json(artwork);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error updating artwork"
        });
    }
});
app.put("/paintingorders/:id", async (req, res) => {
try {
const updatedOrder = await PaintingOrder.findByIdAndUpdate(
req.params.id,
{ status: req.body.status },
{ new: true }
);
    if (req.body.status === "Completed") {
        for (const item of updatedOrder.items) {
            console.log("Updating artwork:",item.id)
            const artwork=await Artwork.findOneAndUpdate(
                { id: item.id },
                { availability: false },
                {new:true}
            );
            console.log("Updated artwork",artwork)
        }
    }
    res.json(updatedOrder);
} catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Error updating painting order"
    });
}
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});