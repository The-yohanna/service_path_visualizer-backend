const express = require("express");
const app = express();
const nodeRoute = require("./routes/nodes");
const pathRoute = require("./routes/paths");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

export const dbconnection = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected succesfully");
  })
  .catch((err) => {
    console.log("Connection err", err);
    process.exit();
  });



app.get("/", (req, res) => {
  res.send("welcome to the yohanna's application");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/nodes", nodeRoute);
app.use("/paths", pathRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
