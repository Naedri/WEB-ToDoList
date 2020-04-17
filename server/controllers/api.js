// server/controllers/api.js

// service list and task
const ServiceListe = require("../services/liste.js");
const ServiceSousTache=require("../services/soustache.js");
const ServiceTache=require("../services/tache.js");

// service user
const ServiceUser =  require("../services/user.js");
const ServiceEmail =  require("../services/email.js");
//const jwt = require('jsonwebtoken');
//const helpers = require("../helpers/helpers");

// router
const express = require("express");
const router = express.Router();

/* router for Lists and tasks *****************************/


//Retourner toutes les listes
  router.get("/api/everything/", (req, res) => {
    ServiceListe.getAll((err, result)=>{
        if(err){
            res.status(500).json({ message: err });
        }else{
            res.json(result);
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
        res.json(req.params.id);
      }
    });
  });

//################################### TACHES

  // tâche ajouter supprimer modifier

  router.post("/tache", (req, res) => {
    const infoCreaTache={
      ...req.body
    }
    console.log(infoCreaTache);
    ServiceTache.create(infoCreaTache ,(err, result)=>{
      if(err){
          console.log(result);
          res.status(500).json({ message: err });
      }else{
          res.json(result);
      }
    });
  });


  router.patch("/tache/:id([0-9]*)", (req, res) => {
    const infoTache={
      ...req.body,
      idTache: req.params.id
    }
    ServiceTache.update(infoTache,(err, result)=>{
        if(err){
            console.log(result);
            res.status(500).json({ message: err });
        }else{
            console.log("MAJ de la tache : "+req.params.id);
            res.json(req.params.id);
        }
      });
  });



  router.delete("/tache/:id([0-9]*)", (req, res) => {
    ServiceTache.deleteById(req.params.id, (err, result) => {
      if (err) {
        res.status(500).send();
        console.log("erreur 500");
      }
      else{
        console.log("Liste supprimée : "+req.params.id);
        res.json(req.params.id);
      }
    });
  });



  //################################### SOUS TACHES
//sous tâche ajouter supprimer modifier

  //Retourne toutes les sous-tâches
  router.get("/soustache", (req, res) => {
    ServiceSousTache.getAll((err, result)=>{
        if(err){
            res.status(500).json({ message: err });
        }else{
            res.json(result);
        }
      });
  });


router.post("/soustache", (req, res) => {
  const infoCreaSouSTache={
    ...req.body
  }
  console.log(infoCreaSouSTache);
  ServiceTache.create(infoCreaSouSTache ,(err, result)=>{
    if(err){
        console.log(result);
        res.status(500).json({ message: err });
    }else{
        res.json(result);
    }
  });
});


router.patch("/soustache/:id([0-9]*)", (req, res) => {
  const infoSouSTache={
    ...req.body,
    idTache: req.params.id
  }
  ServiceTache.update(infoSouSTache,(err, result)=>{
      if(err){
          console.log(result);
          res.status(500).json({ message: err });
      }else{
          console.log("MAJ de la soustache : "+req.params.id);
          res.json(req.params.id);
      }
    });
});

router.delete("/soustache/:id([0-9]*)", (req, res) => {
  ServiceTache.deleteById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).send();
      console.log("erreur 500");
    }
    else{
      console.log("Liste supprimée : "+req.params.id);
      res.json(req.params.id);
    }
  });
});










/* router for user *****************************/

// state : not done (should check if email2 is free)
// Adding an user
// @param: email, password
router.post('/user/signup', (req, res, next) => {

  ServiceUser.createUser(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ message: result });
      return;
    }

    res.json({
      message: `Utilisateur ${result.email} crée avec succès.`,
      id: result.id,
      username: result.username,
      email: result.email
    });
  });
});

// state : done
// Authentification and JWT token recuperation
// @param: email, password
router.post("/user/login", (req, res, next) => {

  ServiceUser.authentificateUser(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ message: result });
      return;
    }

    const userFound = result;
    if (userFound) {
      const token = jwt.sign(
        { username: req.body.username }, 
        config.secret, 
        { expiresIn: '24h' }
      );
      res.json({
        message: 'Authentication successful!',
        token: token
      });
    } else {
      res.status(403).json({
        message: 'Incorrect username or password'
      });
    }
  });
});



//Retourner toutes les listes et les taches
router.get("/everything", (req, res) => {
  ServiceListe.getAllComplete((err, result)=>{
      if(err){
          console.log(result);
          res.status(500).json({ message: err });
      }else{
          console.log(result);
          res.json(result);
      }
    });
});






  module.exports = router;