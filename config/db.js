const  mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://akram:akram@cluster0.8dizhwz.mongodb.net/pedagogie?appName=Cluster0", {
      dbName: "pedagogie",
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB