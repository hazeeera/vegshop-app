const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:
    {
    type:String,
    requires:true,
    unique:true,
    match:[/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
},
    password:{type:String,
        required:true,
        minlength:[6,"Password must be at least 6 characters long"],
        validate: {
        validator:function(value){
            return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value);


        },
        message: "Password must contain at least one letter and one number",
    },

    },



});
module.exports=mongoose.model("User",userSchema);