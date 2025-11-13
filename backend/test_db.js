import mongoose from "mongoose";

mongoose.connect("your-mongo-uri")
  .then(() => {
    console.log(" Connected to MongoDB Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });
