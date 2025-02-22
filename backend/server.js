require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/budgets", require("./routes/budgets"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
