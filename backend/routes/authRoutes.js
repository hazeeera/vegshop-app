const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const User=require("../models/User");
const router=express.Router();
router.post("/register",async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({msg:"User already exists"});
        const hashPassword=await bcrypt.hash(password,10);
        const user=new User({name,email,password:hashPassword});
        await user.save();
        res.json({msg:"Registered successfully"});
    

    }catch(err){
        res.status(500).json({error:err.message});
    }
  

});

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Enter Valid Credentials" });
  
      // create token with _id
      // const token = jwt.sign({ id: user._id }, "prabhas@8", { expiresIn: "8h" });
      const token = jwt.sign(
        { id: user._id,email: user.email },
        process.env.JWT_SECRET || "prabhas@8",
        { expiresIn: "30d" }
      );
  
      // return token + user details
      res.json({
        msg: "User Logged in successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;