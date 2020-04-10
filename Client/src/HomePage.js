import React, { useState, useEffect } from "react";
import TodoApp from './components/TodoApp';
import Lists from './components/Lists'
import ListForm from './components/ListForm';
import TodoListItemMenu from './components/TodoListItemMenu'
import home from './assets/home.svg';
import del from './assets/delete-forever.svg';
//import settings from './assets/settings.svg';
import { getLists, createList, deletelist, createTask, editTaskAPI, deleteTaskAPI } from './api.js';
import NextTasks from "./components/NextTasks";

let Home = props => {

    const [todoLists, setTodos] = useState([])
    const [selectedListId, setSelectedListId] = useState(0);
    const [onEdit, setEdit] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [changeEditBorder, setChangeEditBorder] = useState(false);
    const [renderHome, setRenderHome] = useState(true);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchLists() {
            setLoading(true);
            let lists = await getLists()
            setTodos(lists)
            setLoading(false);
        }

        fetchLists()
    }, [])



    /**
     * Supprime la liste selectionnée
     */
    const deleteList = async () => {
        let id = selectedListId;
        let selectedList = todoLists.find(list => list.id === id);
        try {
            if (window.confirm(`Attention cette action est irreversible, êtes vous sur de vouloir supprimer la liste ${selectedList.title}?`)) {
                setRenderHome(true);
                setLoading(true);
                await deletelist(selectedList);
                let newToDos = todoLists.filter(todoList => todoList.id !== id);
                setTodos(newToDos);
                setEdit(false);
                setSelectedListId(null);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Change la liste courante
     * @param {*} id L'id de la nouvelle liste courante
     */
    const changeList = (id) => {
        if (onEdit) {
            setChangeEditBorder(true);
            return;
        }
        setSelectedListId(id);
        setEdit(false);
        setRenderHome(false);
    }

    /**
     * Edite une tâche (note, titre, échéance, sous tâches ...)
     * @param {*} editedTask La nouvelle tâche éditée
     */
    const editTask = async (editedTask, id) => {
        let newTodos = [...todoLists]; //copier l'array
        let selectedList = newTodos.find(list => list.id === id);
        try {
            await (editTaskAPI(selectedList, editedTask));
            selectedList.tasks = selectedList.tasks.map(task => task.index === editedTask.index ? editedTask : task)
            newTodos = newTodos.map(list => list.id === selectedList.id ? selectedList : list);
            setTodos(newTodos);
            setEdit(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    /**
     * Ajoute une nouvelle liste
     * @param {*} list Le titre de la nouvelle liste à ajoutée
     */
    const addList = async (list) => {
        if (onEdit) {
            setChangeEditBorder(true);
            return;
        }
        try {
            //setLoading(true);
            let response = await createList(list);
            let newList = response.newList;
            setTodos([...todoLists, newList]);
            setSelectedListId(newList.id)
            setRenderHome(false);
            //setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * ouvre le menu d'édition d'une tâche
     * @param {*} index identifiant de la tâche
     * @param listIndex identifiant de la liste
     */
    const openEditMenu = (index, listIndex) => {
        if (onEdit) {
            setChangeEditBorder(true);
            return;
        }
        setSelectedTask(todoLists.find(list => list.id === listIndex).tasks.find(task => task.index === index));
        setSelectedListId(listIndex);
        setEdit(true);
        setChangeEditBorder(false);
    }

    /**
     * Annule l'édition d'une tâche, les changements ne sont pas enregistrés
     */
    const onCancelEdit = () => {
        setEdit(false);
    }

    /**
     * Ajoute une nouvelle tâche
     * @param {*} todoItem La tâche à ajouter
     * @param {*} id L'id de la liste qui contient cette tâche
     */
    const addItem = async (todoItem, id) => {
        let newTodos = [...todoLists];
        let chosenList = newTodos.find(list => list.id === id);
        try {
            let response = await createTask(chosenList, { title: todoItem.newItemValue });
            chosenList.tasks.push(response);
            newTodos = newTodos.map(list => list.id === id ? chosenList : list);
            setTodos(newTodos);
        }
        catch (err) {
            console.log(err);
        }
    }

    /**
     * Supprime une tâche dans une liste
     * @param {*} itemIndex  l'indice de l'item a supprimé
     * @param {*} id l'indice de la liste en question
     */
    const removeItem = async (itemIndex, id) => {
        if (onEdit) {
            setChangeEditBorder(true);
            return;
        }
        let newTodos = [...todoLists];
        let selectedList = newTodos.find(list => list.id === id);
        try {
            await deleteTaskAPI(selectedList, { index: itemIndex });
            let updatedTasks = selectedList.tasks.filter(task => task.index !== itemIndex);
            selectedList.tasks = updatedTasks;
            newTodos = newTodos.map(list => list.id === id ? selectedList : list);
            setTodos(newTodos);
        }
        catch (err) {
            console.log(err);
        }

    }

    /**
     * Marque une tâche comme faite/non faite lorsqu'on clique sur la checkbox
     * @param {*} itemIndex L'id de la tâche
     * @param {*} id  L'id de la liste
     */
    const markTodoDone = async (itemIndex, id) => {
        let newTodos = [...todoLists];
        let selectedList = newTodos.find(list => list.id === id);
        let selectedTask = selectedList.tasks.find(task => task.index === itemIndex);
        selectedTask.done = !selectedTask.done;
        try {
            editTaskAPI(selectedList, selectedTask);
            newTodos = newTodos.map(list => list.id === id ? selectedList : list);
            setTodos(newTodos);
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Renvoie la page d'accueil des listes
     */
    const isHome = () => {
        if (onEdit) {
            setChangeEditBorder(true);
            return;
        }
        setRenderHome(true);
    }

    let id = selectedListId;
    let selectedList = todoLists.find(list => list.id === id);
    let hasLists = todoLists.length > 0;
    let borderClass = changeEditBorder ? "col-sm-3 fill border-left border-warning" : "col-sm-3 fill border-left";

    if (isLoading)
        return (<p>Loading ...</p>)
    return (
        <div className="main-wrapper container-fluid">
            <div className="row">
                <div className="col-sm-3 border-right menu">
                    <img src={home} onClick={isHome} className="cursor-pointer" alt="home logo" /> <strong>toto@gmail.com</strong>
                    <Lists changeList={changeList} lists={todoLists} />
                    <ListForm addList={addList} />
                    <div className="mt-auto">
                    </div>
                </div>
                <div className={onEdit ? "col-sm-5" : "col-sm-7"}>
                    <div className="row">
                        <div className="col-sm">
                            {renderHome ? <h1>Prochaines tâches</h1> : hasLists && <h1>{selectedList.title}</h1>}
                        </div>
                        <div className="col-sm-auto">
                            {renderHome ? null : hasLists && <button type="button" onClick={deleteList} className="btn btn-danger pull-right mr-2"><img src={del} alt="delete logo"></img>&nbsp;Supprimer la liste</button>}
                        </div>
                    </div>
                    {renderHome ? <NextTasks lists={todoLists} removeItem={removeItem} markTodoDone={markTodoDone} addItem={addItem} showEditMenu={openEditMenu} />
                        : hasLists && <TodoApp id={selectedList.id} initItems={selectedList.tasks} title={selectedList.title} removeItem={removeItem} markTodoDone={markTodoDone} addItem={addItem} showEditMenu={openEditMenu} />}
                </div>
                {onEdit && <div className={borderClass} >
                    <TodoListItemMenu listId={id} task={selectedTask} infoMessage={changeEditBorder ? "true" : null} onSubmit={editTask} onCancelEdit={onCancelEdit} />
                </div>
                }
            </div>
        </div>
    );

}
export default Home;