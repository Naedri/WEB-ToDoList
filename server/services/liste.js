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

  /*
  function getAll(callback) {
    const query = 
    `SELECT  l.id as idListe, l.username, l.titre as TitreListe, t.idliste as idlisteTache, t.id as idTache, t.titre as TitreTache, t.echeance as EcheanceTache, t.note as NoteTache, t.fait as FaitTache, st.id as idSousTache, st.titre as TitreSousTache, st.fait as FaitSousTache
    FROM liste l, tache t, soustache st
    WHERE l.id=t.id AND t.id=st.id`;
    utils.executeQuery(query, [], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows);
      }
    });
  }*/


  function getAll(callback) {
    const query = 
    `SELECT *
    FROM LISTE`;
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

/*
  function getById({listeID,username}, callback) {
    const query = 
    `SELECT  l.id, l.username, l.titre, t.id, t.titre, t.echeance, t.note, t.fait, st.id, st.titre, st.fait
    FROM liste l, tache t, soustache st
    WHERE l.id=$1 AND l.username=$2`;
    utils.executeQuery(query, [listeID, username], (err, result) => {
      if (err) {
        callback(true, err);
      } else if (result.rows.length === 0) {
        callback(true, `Impossible de retrouver le projet ${listeID}`);
      } else {
        callback(undefined);
      }
    });
  }*/


  function getById(listeID, callback) {
    const query = 
    `SELECT *
    FROM LISTE
    WHERE id=$1`;
    utils.executeQuery(query, [listeID], (err, result) => {
      if (err) {
        callback(true, err);
      } //else if (result.rows.length === 0) {
        //callback(true, `Impossible de retrouver le projet ${listeID}`);
     // } 
      else {
        callback(undefined, result.rows);
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
        callback(undefined);
      }
    });
  }


  //pour tester
/*
  const user="1";
  let title="bloblo";
  getAll((err, result)=>{
    if(err){
      console.log(result)
    }else{
      console.log(result)
    }
  });
*/