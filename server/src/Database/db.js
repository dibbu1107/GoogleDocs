const mongoose = require("mongoose");

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://root:root@cluster0.omruksc.mongodb.net/flotech?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    // Log a success message if the connection is established
    console.log("MongoDB connected");
  } catch (error) {
    // Log an error message if the connection fails
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectDB;
