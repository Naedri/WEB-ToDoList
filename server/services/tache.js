const utils = require("../db/utils"); 



module.exports = {
    create,
    update,
    deleteById
  };
 


//créer une tâche et une sous-tâche en même temps ?
  function create({username, titre }, callback) {
    const query = 
    `INSERT INTO TACHE (username, titre) 
    VALUES ($1, $2) 
    RETURNING *`;
    utils.executeQuery(query, [username, titre], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, { tacheID: result.rows[0].id });
      }
    });
  }


  function deleteById(projectId, callback) {
    const query = "DELETE FROM LISTE WHERE id=$1";
    utils.executeQuery(query, [projectId], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }


  function update({ projectId, titre }, callback) {
    const query = "UPDATE LISTE SET titre=$1 WHERE id=$2 RETURNING *";
    utils.executeQuery(query, [titre, projectId], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows[0]);
      }
    });
  }