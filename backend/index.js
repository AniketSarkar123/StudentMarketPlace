const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON requests

// Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
