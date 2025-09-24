const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Import routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("SRMsolutions Backend Running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
