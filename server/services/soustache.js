const utils = require("../db/utils"); 



module.exports = {
    create,
    update,
    deleteById,
    getAll,
    getById,
    updateRealisation
  };
 


  function getAll(callback) {
    const query = 
    `SELECT *
    FROM SOUSTACHE`;
    utils.executeQuery(query, [], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows);
      }
    });
  }



  function getById(SousTacheID,callback) {
    const query = 
    `SELECT *
    FROM SOUSTACHE
    WHERE id=$1`;
    utils.executeQuery(query, [SousTacheID], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows);
      }
    });
  }





//créer une tâche et une sous-tâche en même temps ?
  function create({idtache, titre, fait}, callback) {
    const query = 
    `INSERT INTO SOUSTACHE (idtache, titre, fait) 
    VALUES ($1, $2, $3)
    RETURNING *`;
    utils.executeQuery(query, [idtache, titre, fait], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows[0]);
      }
    });
  }


  function deleteById(projectId, callback) {
    const query = "DELETE FROM SOUSTACHE WHERE id=$1";
    utils.executeQuery(query, [projectId], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }

  //Supprimer et tout recréer
  //On m'envoie une soustâche, je ne sais pas si elle est en édition
  //ou si elle est nouvellement créé
  //je dois vérifier la tâche est déjà créé ou si elle existe déjà
  

  function update({fait, id}, callback) {
    const query = `UPDATE SOUSTACHE SET fait=$1 
    WHERE id=$2`;
    utils.executeQuery(query, [fait, id], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }


  //Modifier l'état de réalisation d'une sous-tâche avec un boolean
  function updateRealisation({realisation, idTache}, callback) {
    const query = `UPDATE SOUSTACHE SET fait=$1
    WHERE id=$2`;
    utils.executeQuery(query, [realisation, idTache], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }


  //pour tester
/*
  const objreq={
    idtache:1,
    titre:"Les chemises vertes",
  };

  const id="2";

  create(objreq, (err, result)=>{
    if(err){
      console.log(result)
    }else{
      console.log("ok")
    }
  });
  */