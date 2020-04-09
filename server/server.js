let express = require('express')
let lowdb = require('lowdb')
let FileSync = require('lowdb/adapters/FileSync')
let bodyParser = require('body-parser')
let cors = require('cors')
let adapter = new FileSync('db.json')
let db = lowdb(adapter)
let shortid = require('shortid')

let app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Renvoie toutes les listes
app.get('/lists', (req, res) => {
    let lists = db.get('lists').value()
    return res.json(lists)
})

//créer une liste
app.post('/lists', (req, res) => {
    let newList = {
        id: shortid.generate(),
        title: req.body.value,
        tasks: []
    }
    db.get('lists')
        .push(newList)
        .write()
    console.log(newList)
    return res.json({ newList });
})

//suppr une liste
app.delete('/list/:id', (req, res) => {
    db.get('lists').remove({ id: req.params.id }).write()

    return res.status(204).send()
})

//creer une tache
app.post('/list/:id', (req, res) => {

    let list = db.get('lists').find({ id: req.params.id }).value()
    if (!list) {
        return res.status(404).send()
    }
    let newTask = {
        index: shortid.generate(),
        value: req.body.title,
        note: req.body.note || "",
        date: req.body.date || "",
        stages: req.body.stages || [],
        done: req.body.done || false
    }

    let tasks = [...list.tasks, newTask]
    db.get('lists').find({ id: req.params.id }).assign({ tasks }).write()

    return res.json(newTask)
})


//récuperer une liste avec son id
app.get('/lists/:id', (req, res) => {
    let list = db.get('lists').find({ id: req.params.id }).value()

    if (!list) {
        return res.status(404).send()
    }

    return res.json(list)
})

//supprimer une tache
app.delete('/lists/:idList/tasks/:idTask', (req, res) => {
    let list = db.get('lists').find({ id: req.params.idList }).value()

    if (!list) {
        return res.status(404).send()
    }

    let tasks = list.tasks.filter(
        task => task.index !== req.params.idTask
    );

    db.get('lists')
        .find({ id: req.params.idList })
        .assign({ tasks })
        .write()

    return res.status(204).send()
});

//editer une tache
app.patch('/lists/:idList/:idTask', (req, res) => {
    let list = db.get('lists').find({ id: req.params.idList }).value();

    if (!list) {
        return res.status(404).send();
    }
    console.log(req.body);
    let newTask = {
        index: req.params.idTask,
        value: req.body.value,
        note: req.body.note || "",
        date: req.body.date || "",
        stages: req.body.stages || [],
        done: req.body.done || false
    }
    let editedTasks = list.tasks.map(task => task.index === req.params.idTask ? newTask : task);
    db.get('lists')
        .find({ id: req.params.idList })
        .assign({ tasks : editedTasks })
        .write()

    return res.json(newTask);
})

app.listen(8001, () => {
    console.log('Server running on http://localhost:8001')
})
