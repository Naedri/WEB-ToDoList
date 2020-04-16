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
  function create({idtache, titre}, callback) {
    const query = 
    `INSERT INTO SOUSTACHE (idtache, titre, fait) 
    VALUES ($1, $2, FALSE)
    RETURNING *`;
    utils.executeQuery(query, [idtache, titre], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, { idlist: result.rows[0].id });
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
  

  function update({titre, realisation }, callback) {
    const query = `UPDATE SOUSTACHE SET titre=$1, fait=$2 
    WHERE id=$3`;
    utils.executeQuery(query, [titre, realisation], (err, result) => {
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