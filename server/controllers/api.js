const ListeServices = require("../services/liste.js");
const express = require("express");
const router = express.Router();

/*
//Renvoie toutes les listes
app.get('/lists', (req, res) => {
    let lists = db.get('lists').value()
    return res.json(lists)
})


router.get("/lists", (req, res) => {
    const orderBy = req.query.orderby;
    projectsServices.getAll(orderBy, (err, projectsList) => {
      if (err) {
        res.status(500).json({ message: err });
        return;
      }
  
      // Ajouter l'URI depuis laquelle avoir les details du projet
      projectsList = projectsList.map(project => ({ 
        ...project, 
        "@details_uri": `${helpers.getBaseURI(req)}/api/projects/${project.id}` 
      }));
      res.json({ projectsList: projectsList });
    });
  });


  router.get("/", (req, res) => {
    // Execution des commandes SQL
    pool.query("SELECT * FROM projects LIMIT 100", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const projectsList = result.rows;
        res.render("projects", {
          title: "Projets",
          projectsList: projectsList
        });
      }
    });
  });
*/

/*
const objreq={
    titre:"Les chemises update",
    date:'2025-05-18',
    note:"blabla update",
    realisation:"true",
    id:"2"
  };
*/


  router.get("/lists", (req, res) => {
    // Execution des commandes SQL
    
    ListeServices.getAll((err, result)=>{
        if(err){
            console.log(result);
            res.status(500).json({ message: err });
        }else{
            
            result2 = result.map(liste => ({ 
                //...liste, 
               // "@details_uri": `${helpers.getBaseURI(req)}/api/projects/${project.id}` 
                idliste:liste.idliste,
                username:liste.username,
                titreliste:liste.titreliste,
                tache:[{
                  idtache:liste.idtache,
                  titretache:liste.titretache,
                  echeancetache:liste.echeancetache,
                  notetache:liste.notetache,
                  faittache:liste.faittache,
                  soustache:[{
                    idsoustache:liste.idsoustache,
                    titresoustache:liste.titresoustache,
                    faitsoustache:liste.faitsoustache
                  }]

                }]
              }));

            
            console.log(result);
            res.json(result2);
        }
      });
  });


  module.exports = router;