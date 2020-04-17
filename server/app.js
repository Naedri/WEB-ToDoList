const express = require("express");
const app = express();
const apiRoutes = require('./controllers/api.js');
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use("/api", apiRoutes);


let server = app.listen(8000, () => {
  console.log(`Server started. Listening on port`);
});