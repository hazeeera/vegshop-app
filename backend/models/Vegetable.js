const mongoose=require("mongoose");
const vegetableSchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,requires:true},
    price:{type:Number,required:true},
    category: { type: String, required: true, default: "Vegetable" }

});
module.export=mongoose.model("Vegetable",vegetableSchema);
