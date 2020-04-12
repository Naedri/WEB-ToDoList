const utils = require("../db/utils");


module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
  };
 

  //RAJOUTER WHERE ... AND l.username=$1
  //Pour l'avoir pour chaque utilisateur
  function getAll(callback) {
    const query = 
    `SELECT  l.id, l.username, t.id, t.titre, t.echeance, t.note, t.fait, st.id, st.titre, st.fait
    FROM liste l, tache t, soustache st
    WHERE l.id=t.id AND t.id=st.id`;
    utils.executeQuery(query, [], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows);
      }
    });
  }

//RAJOUTER WHERE ... AND l.username=$2
//pour l'avoir pour chaque utilisateur
  function getById(projectId, callback) {
    const query = 
    `SELECT  l.id, l.username, t.id, t.titre, t.echeance, t.note, t.fait, st.id, st.titre, st.fait
    FROM liste l, tache t, soustache st
    WHERE l.id=$1`;
    utils.executeQuery(query, [projectId], (err, result) => {
      if (err) {
        callback(true, err);
      } else if (result.rows.length === 0) {
        callback(true, `Impossible de retrouver le projet ${projectId}`);
      } else {
        callback(undefined, result.rows[0]);
      }
    });
  }


  function create({username, titre}, callback) {
    const query = 
    `INSERT INTO LISTE (username, titre) 
    VALUES ($1, $2)`;
    utils.executeQuery(query, [username, titre], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }

//Normalement le "ON CASCADE" lors de la création
//de la bdd n'oblige pas à rechercher les tâches et sous-tâches
//elles devraient être supprimées automatiquement
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

  let user="blibli";
  let title="bloblo";
  create({user, title}, (err, result)=>{
    if(err){
      console.log(result)
    }else{
      console.log("ajout liste ok")
    }
  });
