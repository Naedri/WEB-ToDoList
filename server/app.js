const express = require("express");
const app = express();
const apiRoutes = require('./controllers/api.js');



app.use("/api", apiRoutes);


let server = app.listen(8000, () => {
  console.log(`Server started. Listening on port 8000`);
});