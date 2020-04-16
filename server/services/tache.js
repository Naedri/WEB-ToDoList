const utils = require("../db/utils"); 



module.exports = {
    create,
    update,
    deleteById,
    updateRealisation,
    getAll,
    getById
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




  function getById(tacheID,callback) {
    const query = 
    `SELECT *
    FROM SOUSTACHE
    WHERE id=$1`;
    utils.executeQuery(query, [tacheID], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined, result.rows);
      }
    });
  }





//créer une tâche et une sous-tâche en même temps ?
  function create({idListe, titre, date, note}, callback) {
    const query = 
    `INSERT INTO TACHE (idListe, titre, echeance, note, fait) 
    VALUES ($1, $2, $3, $4, FALSE);`;
    utils.executeQuery(query, [idListe, titre, date, note], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }

//Supprimer une tâche via son identifiant
  function deleteById(projectId, callback) {
    const query = "DELETE FROM TACHE WHERE id=$1";
    utils.executeQuery(query, [projectId], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }

  //Un Update pour changer "tout"
  //un autre pour simplement mettre que la tâche est faite ?
  //action bouton ?


//Modifier une tâche
  function update({titre, date, note, realisation, idTache }, callback) {
    const query = `UPDATE TACHE SET titre=$1, echeance=$2, note=$3, fait=$4 
    WHERE id=$5`;
    utils.executeQuery(query, [titre, date, note, realisation, idTache], (err, result) => {
      if (err) {
        callback(true, err);
      } else {
        callback(undefined);
      }
    });
  }

//Modifier l'état de réalisation d'une tâche avec un boolean
  function updateRealisation({realisation, idTache}, callback) {
    const query = `UPDATE TACHE SET fait=$1
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
    titre:"Les chemises update",
    date:'2025-05-18',
    note:"blabla update",
    realisation:"true",
    id:"2"
  };

  const id="4";

  update(objreq, (err, result)=>{
    if(err){
      console.log(result)
    }else{
      console.log("ok")
    }
  });
  */