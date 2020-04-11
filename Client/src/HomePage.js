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
    const [state, dispatch] = React.useReducer(
        todoReducer,
        {
            toDos: [],
            listId: null
        }
    );

    useEffect(() => {
        async function fetchLists() {
            setLoading(true);
            let lists = await getLists();
            dispatch({ type: 'INIT', toDos: lists })
            setLoading(false);
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
    }

    /**
     * Edite une tâche (note, titre, échéance, sous tâches ...)
     * @param {*} editedTask La nouvelle tâche éditée
     */
    const editTask = async (editedTask, id) => {
        let newTodos = [...state.toDos]; //copier l'array
        let selectedList = newTodos.find(list => list.id === id);
        try {
            await (editTaskAPI(selectedList, editedTask));
            selectedList.tasks = selectedList.tasks.map(task => task.index === editedTask.index ? editedTask : task)
            newTodos = newTodos.map(list => list.id === selectedList.id ? selectedList : list);
            dispatch({ type: 'EDIT_TASK', toDos: newTodos })
            setEdit(false);
        }
        catch (err) {
            console.log(err);
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
            let response = await createList(list);//appel à l'api
            let newList = response.newList;
            dispatch({ type: 'ADD_LIST', toDos: [...state.toDos, newList], listId: newList.id })
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
            setWarning(true);
            return;
        }
        setSelectedTask(state.toDos.find(list => list.id === listIndex).tasks.find(task => task.index === index));
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
            let response = await createTask(chosenList, { title: todoItem.newItemValue });
            chosenList.tasks.push(response);
            newTodos = newTodos.map(list => list.id === id ? chosenList : list);
            dispatch({ type: 'INIT', toDos: newTodos })
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
            setWarning(true);
            return;
        }
        let newTodos = [...state.toDos];
        let selectedList = newTodos.find(list => list.id === id);
        try {
            await deleteTaskAPI(selectedList, { index: itemIndex });
            let updatedTasks = selectedList.tasks.filter(task => task.index !== itemIndex);
            selectedList.tasks = updatedTasks;
            newTodos = newTodos.map(list => list.id === id ? selectedList : list);
            dispatch({ type: 'REMOVE_TASK', toDos: newTodos })
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
        let newTodos = [...state.toDos];
        let selectedList = newTodos.find(list => list.id === id);
        let selectedTask = selectedList.tasks.find(task => task.index === itemIndex);
        selectedTask.done = !selectedTask.done;
        try {
            editTaskAPI(selectedList, selectedTask);
            newTodos = newTodos.map(list => list.id === id ? selectedList : list);
            dispatch({ type: 'MTD', toDos: newTodos })
        } catch (err) {
            console.log(err);
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
        setRenderHome(true);
    }

    let id = state.listId;
    let selectedList = state.toDos.find(list => list.id === id);
    let hasLists = state.toDos.length > 0;
    let borderClass = changeEditBorder ? "col-sm-3 fill border-left border-warning" : "col-sm-3 fill border-left";

    if (isLoading)
        return (<p>Loading ...</p>)
    return (
        <div className="main-wrapper container-fluid">
            <div className="row">
                <div className="col-sm-3 border-right menu">
                    <img src={home} onClick={isHome} className="cursor-pointer" alt="home logo" /> <strong>toto@gmail.com</strong>
                    <Lists changeList={changeList} lists={state.toDos} />
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
                    {renderHome ? <NextTasks lists={state.toDos} removeItem={removeItem} markTodoDone={markTodoDone} addItem={addItem} showEditMenu={openEditMenu} />
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