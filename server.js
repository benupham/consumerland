const express = require("express");
const app = express();

app.get("/api", (req, res) => {
    res.send("Hello");
    console.log('something happened');
});
app.listen(8080, () => console.log("Listening on port 8080!"));
