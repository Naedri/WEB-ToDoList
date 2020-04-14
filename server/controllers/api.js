const ServiceListe = require("../services/liste.js");
const ServiceSousTache=require("../services/soustache.js");
const ServiceTache=require("../services/tache.js");
const express = require("express");
const router = express.Router();



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

  /*app.get('/lists/:id', (req, res) => {
    let list = db.get('lists').find({ id: req.params.id }).value()

    if (!list) {
        return res.status(404).send()
    }

    return res.json(list)
})*/

  router.get("/lists/:id([0-9]*)", (req, res) => {
    ServiceListe.getById(req.params.id, (err, result) => {
      if (err) {
        res.status(500).send();
      }
      else{
        res.json(result);
      }
    });
  });








  module.exports = router;