const express = require("express");
const app = express();
const apiRoutes = require('./controllers/api.js');



app.use("/api", apiRoutes);


let server = app.listen(3000, () => {
  console.log(`Server started. Listening on port 3000`);
});