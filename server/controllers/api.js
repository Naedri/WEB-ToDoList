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
  router.get("/lists", (req, res) => {
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

  //Retourne toutes les sous-tâches
  router.get("/soustache", (req, res) => {
    ServiceSousTache.getAll((err, result)=>{
        if(err){
            console.log(result);
            res.status(500).json({ message: err });
        }else{
            console.log(result);
            res.json(result);
        }
      });
  });


  // tâche ajouter supprimer modifier

  router.post("/tache", (req, res) => {
    ServiceTache.create(req.body.titreTache ,(err, result)=>{
      if(err){
          console.log(result);
          res.status(500).json({ message: err });
      }else{
          console.log(""+result.idlist);
          res.json(result.idlist);
      }
    });
  });


  router.patch("/tache/:id([0-9]*", (req, res) => {
    ServiceTache.update((err, result)=>{
        if(err){
            console.log(result);
            res.status(500).json({ message: err });
        }else{
            console.log(result);
            res.json(result);
        }
      });
  });



  router.delete("/tache/:id([0-9]*", (req, res) => {
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


// state : not done  (falt heplersMW.checkToken, should check if email2 is free)
// Trigger destruction of session
// @param
router.get("/user/logout", (req, res, next) => {

  ServiceUser.quitSessionUser(req.body, (err, result) => {
    if(err){
      res.status(500).json({message: result});
      return;
    }

    res.json({
      message: `Utilisateur ${resut.email} déconnecté.`
    });

  });
});


// state : done
// Trigger an email sending to the user's email including its password
// GET a message telling that an email was sent
// @param: email
router.get("/user/forgetpassword", (req, res, next) => {

  ServiceEmail.sendEmail({}, (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    res.json({ 
      message: 'Message sent: ' + result.response
     });

  });
});

// state : not finished (falt heplersMW.checkToken, should check if email2 is free)
// Updating email to email2
// @param: email, password, email2
router.patch("/user/update/email",(req, res, next)=> {
  ServiceUser.updateEmailUser({},(err,result) => {
    if (err){
      res.status(500).json({ message: err });
      return;
    }
    res.json({
      message: `Email ${req.body.email2} mis à jour avec succès.`
    });
  });
});

// state : not finished (falt heplersMW.checkToken)
// Updating email to email2
// @param: email, password, password2
router.patch("/user/update/password",(req, res, next)=> {
    
  ServiceUser.updatePwdUser({},(err,result) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    res.json({
      message: `Mot de passe mis à jour avec succès.`
    });
  });
});

/*
  // On controle que tous les info necessaires ont bien été passées.
  if ((projectDetails.id && Object.values(projectDetails).length >= 2) === false) {
    res.status(500).json({ 
      'message': `Un ou plusieurs paramètres sont manquant.`
    });
    return; // Pour sortir de la fonction
  }

*/




  module.exports = router;