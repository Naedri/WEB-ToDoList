const ServiceListe = require("../services/liste.js");
const ServiceSousTache=require("../services/soustache.js");
const ServiceTache=require("../services/tache.js");
const express = require("express");
const router = express.Router();


//Retourner toutes les listes
  router.get("/lists", (req, res) => {
    ServiceListe.getAll((err, result)=>{
        if(err){
            console.log(result);
            res.status(500).json({ message: err });
        }else{
            console.log(result);
            res.json(result);
        }
      });
  });

//retourne une liste en particulier (par ID)
  router.get("/lists/:id([0-9]*)", (req, res) => {
    ServiceListe.getById(req.params.id, (err, result) => {
      if (err) {
        res.status(500).send();
        console.log("erreur 500");
      }
      else{
        console.log(result);
        res.json(result);
      }
    });
  });

//Supprime une liste et toutes ses tâches et sous-tâches
  router.delete("/lists/:id([0-9]*)",(req, res) => {
    ServiceListe.deleteById(req.params.id, (err, result) => {
      if (err) {
        res.status(500).send();
        console.log("erreur 500");
      }
      else{
        console.log("Liste supprimée : "+req.params.id);
        res.json("Liste supprimée : "+req.params.id);
      }
    });
  });

//Créer une nouvelle liste à partir d'un titre envoyé par le body
//On renvoie en Json le l'id de la nouvelle liste
  router.post("/lists", (req, res) => {
    ServiceListe.create(req.body.titre ,(err, result)=>{
        if(err){
            console.log(result);
            res.status(500).json({ message: err });
        }else{
            console.log(""+result.idlist);
            res.json(result.idlist);
        }
      });
  });










  module.exports = router;