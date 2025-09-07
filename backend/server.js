const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes=require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoute = require("./routes/contact");
dotenv.config();
const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
const PORT=process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,


})
.then(()=>console.log("database is connectes"))
.catch((err)=>console.error("Mongodb error",err));
app.use("/api/auth",authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/contact", contactRoute);
app.get("/", (req, res) => {
    res.send("API is running...");
  });
app.listen(PORT,()=>{
    console.log(`server is unning on the port${PORT}`);
});




