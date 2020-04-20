// server/controllers/api.js

// service list and task
const ServiceListe = require("../services/liste.js");
const ServiceSousTache = require("../services/soustache.js");
const ServiceTache = require("../services/tache.js");

// service user
const ServiceUser = require("../services/user.js");
const ServiceEmail = require("../services/email.js");
const jwt = require('jsonwebtoken');
const config = require("../db/config.js");
//const helpers = require("../helpers/helpers");

// router
const express = require("express");
const router = express.Router();

/* router for Lists and tasks *****************************/


//Retourner toutes les listes
//Retourner toutes les listes et les taches
router.get("/everything/:email", (req, res) => {
  console.log(req.params.email);
  ServiceListe.getAllComplete(req.params.email,(err, result) => {
    if (err) {
      console.log(result);
      res.status(500).json({ message: err });
    } else {
      result.forEach(liste => {
        liste.taches.forEach(tache => tache.sousTaches = [])
      });
      res.json(result);
    }
  });
});


//Créer une nouvelle liste à partir d'un titre envoyé par le body
//On renvoie en Json le l'id de la nouvelle liste
router.post("/lists", (req, res) => {
  ServiceListe.create(req.body.titre, req.body.email, (err, result) => {
    if (err) {
      console.log(result);
      res.status(500).json({ message: err });
    } else {
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
    else {
      console.log(result);
      res.json(result);
    }
  });
});


//Supprime une liste et toutes ses tâches et sous-tâches
router.delete("/lists/:id([0-9]*)", (req, res) => {
  ServiceListe.deleteById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).send();
      console.log("erreur 500");
    }
    else {
      console.log("Liste supprimée : " + req.params.id);
      res.json(req.params.id);
    }
  });
});

//################################### TACHES

// tâche ajouter supprimer modifier

router.post("/tache", (req, res) => {
  const infoCreaTache = {
    ...req.body
  }
  ServiceTache.create(infoCreaTache, (err, result) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.json(result);
    }
  });
});


router.patch("/tache/:id([0-9]*)", (req, res) => {
  const infoTache = {
    ...req.body,
    idTache: req.params.id
  }
  ServiceTache.update(infoTache, (err, result) => {
    if (err) {
      console.log(result);
      res.status(500).json({ message: err });
    } else {
      console.log("MAJ de la tache : " + req.params.id);
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
    else {
      console.log("Liste supprimée : " + req.params.id);
      res.json(req.params.id);
    }
  });
});



//################################### SOUS TACHES
//sous tâche ajouter supprimer modifier

//Retourne toutes les sous-tâches
router.get("/soustache", (req, res) => {
  ServiceSousTache.getAll((err, result) => {
    if (err) {
      res.status(500).json({ message: err });
    } else {
      res.json(result);
    }
  });
});


router.post("/soustache", (req, res) => {
  const infoCreaSouSTache = {
    ...req.body
  }
  console.log(infoCreaSouSTache);
  ServiceSousTache.create(infoCreaSouSTache, (err, result) => {
    if (err) {
      console.log(result);
      res.status(500).json({ message: err });
    } else {
      res.json(result);
    }
  });
});


router.patch("/soustache/:id([0-9]*)", (req, res) => {
  const infoSouSTache = {
    ...req.body,
    id: req.params.id
  }
  ServiceSousTache.update(infoSouSTache, (err, result) => {
    if (err) {
      console.log(result);
      res.status(500).json({ message: err });
    } else {
      console.log("MAJ de la soustache : " + req.params.id);
      res.json(req.params.id);
    }
  });
});

router.delete("/soustache/:id([0-9]*)", (req, res) => {
  ServiceSousTache.deleteById(req.params.id, (err, result) => {
    if (err) {
      res.status(500).send();
      console.log("erreur 500");
    }
    else {
      console.log("Liste supprimée : " + req.params.id);
      res.json(req.params.id);
    }
  });
});










/* router for user *****************************/


// state : done
// does an email is already used
// @param: email
router.post('/user/free', (req, res, next) => {

  ServiceUser.isFree(req.body.email, (err, result) => {
    if (err) {
      res.status(500).json({ message: result });
      return;
    } else {
      let state = result ? 'available' : 'busy';
      console.log('email ' + state);
      res.json(result);
    }
  });
});

// state : not done (should check if email2 is free)
// Adding an user
// @param: email, password
router.post('/user/signup', (req, res, next) => {

  ServiceUser.create(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ message: result });
      return;
    } else {
      let state = result ? ' ' : ' not ';
      console.log('user' + state + 'created');
      res.json(result);
    }
  });
});



// state : done
// Authentification and JWT token recuperation
// @param: email, password
router.post("/user/login", (req, res, next) => {

  ServiceUser.authenticate(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ message: result });
      return;
    } else {
      let userFound = result ;
      
      if (userFound) {
        const token = jwt.sign(
          { 
            userId: userFound.id,
            email: userFound.email,
           },
          config.secret,
          { expiresIn: '2h' }
        );
        res.json({
          state: true,
          userId: userFound.id,
          email: userFound.email,
          token: token,
          message: "Auth successful",
        });
      
      } else {
        res.status(403).json({
          state: false,
          message: "Auth fail",
        });
      }

      let status = result ? 'successfull' : 'failed';
      console.log(status + ' authentification');
    }
  });
});


// state : done
// Deleting session of a session
// @param: email, password
router.get("/user/logout", (req, res, next) => {
  // Suppression de la session
  req.session.destroy();
  res.redirect("/");
});

/*
router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
*/






module.exports = router;