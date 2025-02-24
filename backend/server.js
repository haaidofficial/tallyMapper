const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const enterpriseRoutes = require("./routes/enterpriseRoute");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static images

// Routes
app.use("/api", enterpriseRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // No need for additional options
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
