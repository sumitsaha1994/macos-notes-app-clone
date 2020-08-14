require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
    console.log(req.url);
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
console.log(process.env.PORT);
app.listen(process.env.PORT || 9000, () => {
    console.log(`Listening to port ${process.env.PORT || 9000}`);
});
