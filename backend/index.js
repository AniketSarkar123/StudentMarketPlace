const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");
const app = express();



app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON requests

// Routes
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/orders", orderRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
