import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import path from "path"
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js"; 
import cookieParser from "cookie-parser";
import cors from "cors";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const stripe = require("stripe")("sk_test_51N11oxSGwsfgNGIl7yfXKVDRYO4qiyJfiPlKjtq4GI5Go9zdELEAwLZJyAUz3k0DZ7qwDxvXEOlI66FJKc6BI7C4007ZFJL0Sa")

dotenv.config()
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to mongodb")
    } catch (error) {
      handleError(error)
    }
};
const app = express();
app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
//middlewares
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);


mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
})

mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!")
})

//deployment
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log("in production");
  console.log("sdjcnskzs");
  app.use(express.static(path.join(__dirname1, "/booking/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "booking", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is Running..");
  });
}



//checkout
app.post("/api/create-checkout-session", async(req, res) => {
    const {products} = req.body;

    const lineItems = products.map((product) => ({
        price_data: {
            currency: "inr",
            product_data: {
                name: product.title
            },
            unit_amount: product.price * 100,
        },
        quantity:1
    }));
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems ,
        mode: "payment",
        success_url:"http://localhost:3000/sucess",
        cancel_url:"http://localhost:3000/cancel",
    });

    res.json({id:session.id});
});


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || " Something went wrong!";
    return res. status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});



app.listen(8800, () => {
    connect()
    console.log("Connected to backend");
})