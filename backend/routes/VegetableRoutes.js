const express=require("express");
const Vegetable=require("../models/Vegetable");
const router=express.Router();
router.post("/add",async(req,res)=>{
    try{
        const vegetables=await Vegetable.insertMany(req.body);
        res.status(201).json({ success: true, data: vegetables });


    }catch(error) {
        res.status(500).json({ success: false, error: error.message });


    }
});
router.get("/",async(req,res)=>{
    try{
        const vegetables=await Vegetable.find();
        res.json(vegetables);

    }catch(err){
        res.status(500).json({err:err.message});

    }
});
module.exports=router;