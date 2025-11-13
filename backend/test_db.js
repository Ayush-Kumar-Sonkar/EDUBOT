import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ayushsonkar55_db_user:PsXEbpW9Huh2ePlE@cluster0.17hytf5.mongodb.net/SIHBOT")
  .then(() => {
    console.log(" Connected to MongoDB Atlas");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });
