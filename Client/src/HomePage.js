import React, { useState, useEffect } from "react";
import TodoApp from './components/TodoApp';
import Lists from './components/Lists'
import ListForm from './components/ListForm';
import TodoListItemMenu from './components/TodoListItemMenu'
import home from './assets/home.svg';
import del from './assets/delete-forever.svg';
import settings from './assets/settings.svg';
import { getLists, createList, deletelist, createTask, editTaskAPI, deleteTaskAPI, editStageApi, createStageApi, deleteStageApi } from './api.js';
import NextTasks from "./components/NextTasks";

import './css/styleToDoList.css' ;
 

const todoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT':
        case 'EDIT_TASK':
        case 'ADD_TASK':
        case 'REMOVE_TASK':
        case 'MTD':
            return { ...state, toDos: action.toDos };
        case 'DELETE':
        case 'ADD_LIST':
            return { ...state, toDos: action.toDos, listId: action.listId };
        case 'CHANGE_LIST':
        case 'OPEN_EDIT_MENU':
            return { ...state, listId: action.listId };
        default:
            return state;
    }
};

let Home = () => {
    const [onEdit, setEdit] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [changeEditBorder, setWarning] = useState(false);
    const [renderHome, setRenderHome] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [renderingSettings, renderSettings] = useState(false);
    const [state, dispatch] = React.useReducer(
        todoReducer,
        {
            toDos: [],
            listId: null
        }
    );

    useEffect(() => {
        async function fetchLists() {
            try {
                setLoading(true);
                let lists = await getLists();
                dispatch({ type: 'INIT', toDos: lists })
                setLoading(false);
            }
            catch (err) {
                setError(err.message);
            }
        }

        fetchLists()
    }, []);

    /**
     * Supprime la liste selectionnée
     */
    const deleteList = async () => {
        let id = state.listId;
        let selectedList = state.toDos.find(list => list.id === id);
        try {
            if (window.confirm(`Attention cette action est irreversible, êtes vous sur de vouloir supprimer la liste ${selectedList.title}?`)) {
                setRenderHome(true);
                setLoading(true);
                await deletelist(selectedList);
                let newToDos = state.toDos.filter(todoList => todoList.id !== id);
                dispatch({ type: 'DELETE', toDos: newToDos, listId: null })
                setEdit(false);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    /**
     * Change la liste courante
     * @param {*} id L'id de la nouvelle liste courante
     */
    const changeList = (id) => {
        if (onEdit) {
            setWarning(true);
            return;
        }
        dispatch({ type: 'CHANGE_LIST', listId: id })
        setEdit(false);
        setRenderHome(false);
        renderSettings(false);
    }

    /**
     * Edite une tâche (note, titre, échéance, sous tâches ...)
     * @param {*} editedTask La nouvelle tâche éditée
     */
    const editTask = async (editedTask, id) => {
        let newTodos = [...state.toDos]; //copier l'array
        let selectedList = newTodos.find(list => list.id === id);
        console.log(`id est ${id}`)

        try {
            //comparaison des nouvelles sous taches et des anciennes
            for (let i = 0; i < editedTask.sousTaches.length; ++i){
                try{
                    let toCreate = editedTask.sousTaches[i];
                    let toSend = {
                        id : toCreate.id,
                        idtache : selectedTask.id,
                        titre : toCreate.titre,
                        fait : toCreate.fait
                    }
                    if (!selectedTask.sousTaches.find(st => st.id === toCreate.id))
                        await createStageApi(toSend)
                    else    
                        await editStageApi(toSend)
                }catch(err){
                    console.log(err);
                }
            }
            //comparaison des anciennes sous taches et des nouvelles pour voir lesquelles ont été supprimés.
            for (let i = 0; i < selectedTask.sousTaches.length; ++i){
                let toDelete = selectedTask.sousTaches[i];
                if (!editedTask.sousTaches.find(st => st.id === toDelete.id))
                    await deleteStageApi(toDelete);
            }
            await (editTaskAPI(editedTask));
            selectedList.taches = selectedList.taches.map(task => task.id === editedTask.id ? editedTask : task)
            newTodos = newTodos.map(list => list.id === selectedList.id ? selectedList : list);
            dispatch({ type: 'EDIT_TASK', toDos: newTodos })
            setEdit(false);
        }
        catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    /**
     * Ajoute une nouvelle liste
     * @param {*} list la nouvelle liste à ajoutée
     */
    const addList = async (list) => {
        if (onEdit) {
            setWarning(true);
            return;
        }
        try {
            //setLoading(true);
            let response = await createList({titre : list.value});//appel à l'api
            let newList = {...response, taches : []};
            dispatch({ type: 'ADD_LIST', toDos: [...state.toDos, newList], listId: newList.id })
            setRenderHome(false);
            renderSettings(false);
            //setLoading(false);
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    /**
     * ouvre le menu d'édition d'une tâche
     * @param {*} index identifiant de la tâche
     * @param listIndex identifiant de la liste
     */
    const openEditMenu = (taskId, listIndex) => {
        if (onEdit) {
            setWarning(true);
            return;
        }
        setSelectedTask(state.toDos.find(list => list.id === listIndex).taches.find(task => task.id === taskId));
        dispatch({ type: 'OPEN_EDIT_MENU', listId: listIndex });
        setEdit(true);
        setWarning(false);
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
        let newTodos = [...state.toDos];
        let chosenList = newTodos.find(list => list.id === id);
        try {
            let response = await createTask(chosenList, { titre: todoItem.newItemValue, fait : false });
            console.log(response)
            chosenList.taches.push({...response, sousTaches : []});
            newTodos = newTodos.map(list => list.id === id ? chosenList : list);
            dispatch({ type: 'INIT', toDos: newTodos })
        }
        catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    /**
     * Supprime une tâche dans une liste
     * @param {*} itemIndex  l'indice de l'item a supprimé
     * @param {*} id l'indice de la liste en question
     */
    const removeItem = async (itemIndex, id) => {
        if (onEdit) {
            setWarning(true);
            return;
        }
        let newTodos = [...state.toDos];
        let selectedList = newTodos.find(list => list.id === id);
        try {
            await deleteTaskAPI(itemIndex);
            let updatedTasks = selectedList.taches.filter(task => task.id !== itemIndex);
            selectedList.taches = updatedTasks;
            newTodos = newTodos.map(list => list.id === id ? selectedList : list);
            dispatch({ type: 'REMOVE_TASK', toDos: newTodos })
        }
        catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    /**
     * Marque une tâche comme faite/non faite lorsqu'on clique sur la checkbox
     * @param {*} itemIndex L'id de la tâche
     * @param {*} id  L'id de la liste
     */
    const markTodoDone = async (itemIndex, id) => {
        let newTodos = [...state.toDos];
        let selectedList = newTodos.find(list => list.id === id);
        let selectedTask = selectedList.taches.find(task => task.id === itemIndex);
        selectedTask.fait = !selectedTask.fait;
        try {
            console.log(selectedTask)
            await editTaskAPI(selectedTask);
            newTodos = newTodos.map(list => list.id === id ? selectedList : list);
            dispatch({ type: 'MTD', toDos: newTodos })
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    /**
     * Renvoie la page d'accueil des listes
     */
    const isHome = () => {
        if (onEdit) {
            setWarning(true);
            return;
        }
        renderSettings(false);
        setRenderHome(true);
    }

    const isSettings = () => {
        if (onEdit) {
            setWarning(true);
            return;
        }
        setRenderHome(false);
        renderSettings(true);
    }
    let id = state.listId;
    let selectedList = state.toDos.find(list => list.id === id);
    let hasLists = state.toDos.length > 0;
    let borderClass = changeEditBorder ? "col-xl-3 fill mt-3 border-left border-warning" : "col-xl-3 mt-3 fill border-left";

    let centerHeader = () => {
        if (renderHome)
            return <h1>Prochaines tâches</h1>
        if (renderingSettings)
            return <h1>Paramètres</h1>
        return hasLists && <h1>{selectedList.titre}</h1>
    }

    let centerContent = () => {
        if (renderHome)
            return <NextTasks lists={state.toDos} removeItem={removeItem} markTodoDone={markTodoDone} addItem={addItem} showEditMenu={openEditMenu} />
        if (renderingSettings)
            return null
        return (
            hasLists && <TodoApp id={selectedList.id} initItems={selectedList.taches} removeItem={removeItem} markTodoDone={markTodoDone} addItem={addItem} showEditMenu={openEditMenu} />
        )
    }

    if (isLoading)
        return (<p>Loading ...</p>)
    if (error)
        return <h2>Something went wrong : {error} </h2>
    return (
        <div className="container-fluid mt-0 full-h ">
            <div className="row full-h ">
                <div className="col-xl-3 border-right border-top menu full-h">
                    <div className="mt-3">
                        <img src={home} onClick={isHome} className="cursor-pointer" alt="home logo" /> <strong>toto@gmail.com</strong>
                    </div>
                    <div className="mt-2 mb-2">
                        <img src={settings} onClick={isSettings} className="cursor-pointer" alt="settings logo" /> <strong>Paramètres</strong>
                    </div>
                    <Lists changeList={changeList} lists={state.toDos} />
                    <ListForm addList={addList} />
                </div>
                <div className={onEdit ? "col-xl-5 full-h  mt-3" : "col-xl-7 full-h  mt-3"}>
                    <div className="row">
                        <div className="col-sm">
                            {centerHeader()}
                        </div>
                        <div className="col-sm-auto">
                            {(renderHome || renderingSettings) ? null : hasLists && <button type="button" onClick={deleteList} className="btn btn-danger pull-right mr-2"><img src={del} alt="delete logo"></img>&nbsp;Supprimer la liste</button>}
                        </div>
                    </div>
                    {centerContent()}
                </div>
                {onEdit && <div className={borderClass} >
                    <TodoListItemMenu task={selectedTask} infoMessage={changeEditBorder ? "true" : null} onSubmit={editTask} onCancelEdit={onCancelEdit} />
                </div>
                }
            </div>
        </div>
    );
}
export default Home;