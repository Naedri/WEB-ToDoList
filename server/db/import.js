const utils = require("./utils");
const fs = require("fs");

// Import du fichier avec les commandes SQL
const dbFilePath = `${__dirname}/initBase.sql`;
const sql = fs.readFileSync(dbFilePath).toString();

// Execution des commandes SQL
utils.executeQuery(sql, [], (err, result) => {
  if (err) {
    console.log(result);
  } else {
    console.log("Import terminé avec succès");
  }
});

