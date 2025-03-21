const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// Routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
