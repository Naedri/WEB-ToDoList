import React, { Component } from "react";
import TodoApp from './components/TodoApp';
import Lists from './components/Lists'
import ListForm from './components/ListForm';
import TodoListItemMenu from './components/TodoListItemMenu'
import home from './assets/home.svg';
import del from './assets/delete-forever.svg';
//import settings from './assets/settings.svg';
import { getLists, createList, deletelist, createTask, editTaskAPI, deleteTaskAPI } from './api.js';
import NextTasks from "./components/NextTasks";

export default class Home extends Component {


    constructor(props) {
        super(props);
        this.fetchLists = this.fetchLists.bind(this);
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.markTodoDone = this.markTodoDone.bind(this);
        this.changeList = this.changeList.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.addList = this.addList.bind(this);
        this.openEditMenu = this.openEditMenu.bind(this);
        this.onCancelEdit = this.onCancelEdit.bind(this);
        this.editTask = this.editTask.bind(this);
        this.isHome = this.isHome.bind(this);
        this.state = {
            todoLists: [],
            selectedListId: 0,
            onEdit: false,
            selectedTask: {},
            changeEditBorder: false,
            renderHome: true
        };
    }

    componentDidMount() {
        this.fetchLists();
    }

    async fetchLists() {
        this.setState({ fetching: true });
        let lists = await getLists()
        this.setState({ todoLists: lists }, () => this.setState({ fetching: false }));
    }

    /**
     * Supprime la liste selectionnée
     */
    async deleteList() {
        let id = this.state.selectedListId;
        let todoLists = this.state.todoLists;
        let selectedList = todoLists.find(list => list.id === id);
        try {
            await deletelist(selectedList);
            if (window.confirm(`Attention cette action est irreversible, êtes vous sur de vouloir supprimer la liste ${selectedList.title}?`)) {
                let newToDos = todoLists.filter(todoList => todoList.id !== id);
                this.setState({ todoLists: newToDos, renderHome: true, onEdit: false });// L'api devra renvoyer les données à jour.
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Change la liste courante
     * @param {*} id L'id de la nouvelle liste courante
     */
    changeList(id) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        this.setState({ selectedListId: id, onEdit: false, renderHome: false }); // l'api n'intervient pas ici
    }

    /**
     * Edite une tâche (note, titre, échéance, sous tâches ...)
     * @param {*} editedTask La nouvelle tâche éditée
     */
    async editTask(editedTask, id) {
        let todoLists = [...this.state.todoLists]; //copier l'array
        let selectedList = todoLists.find(list => list.id === id);
        try {
            await (editTaskAPI(selectedList, editedTask));
            selectedList.tasks = selectedList.tasks.map(task => task.index === editedTask.index ? editedTask : task)
            todoLists = todoLists.map(list => list.id === selectedList.id ? selectedList : list);
            this.setState({ todoLists: todoLists, onEdit: false }) //l'api devra renvoyer la todolist à jour
        }
        catch (err) {
            console.log(err);
        }
    }


    /**
     * Ajoute une nouvelle liste
     * @param {*} list Le titre de la nouvelle liste à ajoutée
     */
    async addList(list) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        try {
            let response = await createList(list);
            console.log(response.newList);
            let newList = response.newList;
            this.setState((state) => {
                return {
                    todoLists: [...state.todoLists, newList],
                    renderHome: false,
                    selectedListId: newList.id
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * ouvre le menu d'édition d'une tâche
     * @param {*} index identifiant de la tâche
     * @param listIndex identifiant de la liste
     */
    openEditMenu(index, listIndex) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        this.setState((state) => {
            return {
                selectedTask: state.todoLists.find(list => list.id === listIndex).tasks.find(task => task.index === index),
                selectedListId : listIndex
            };
        });
        this.setState({ onEdit: true, changeEditBorder: false });
    }

    /**
     * Annule l'édition d'une tâche, les changements ne sont pas enregistrés
     */
    onCancelEdit() {
        this.setState({ onEdit: false });
    }

    /**
     * Ajoute une nouvelle tâche
     * @param {*} todoItem La tâche à ajouter
     * @param {*} id L'id de la liste qui contient cette tâche
     */
    async addItem(todoItem, id) {
        let todoLists = [...this.state.todoLists];
        let chosenList = todoLists.find(list => list.id === id);
        try {
            let response = await createTask(chosenList, { title: todoItem.newItemValue });
            console.log(response);
            let newItem = {
                index: response.index,
                value: todoItem.newItemValue,
                done: false
            };
            chosenList.tasks.push(newItem);
            todoLists = todoLists.map(list => list.id === id ? chosenList : list);
            this.setState({
                todoLists: todoLists
            });
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
    removeItem(itemIndex, id) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        let todoLists = [...this.state.todoLists];
        let selectedList = todoLists.find(list => list.id === id);
        try {
            deleteTaskAPI(selectedList, { index: itemIndex });
            let updatedTasks = selectedList.tasks.filter(task => task.index !== itemIndex);
            selectedList.tasks = updatedTasks;
            todoLists = todoLists.map(list => list.id === id ? selectedList : list);
            this.setState({
                todoLists: todoLists
            });
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
    markTodoDone(itemIndex, id) {
        let todoLists = [...this.state.todoLists];
        let selectedList = todoLists.find(list => list.id === id);
        let selectedTask = selectedList.tasks.find(task => task.index === itemIndex);
        selectedTask.done = !selectedTask.done;
        try {
            editTaskAPI(selectedList, selectedTask);
            todoLists = todoLists.map(list => list.id === id ? selectedList : list);
            this.setState({
                todoLists: todoLists
            });
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * Renvoie la page d'accueil des listes
     */
    isHome() {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        this.setState({ renderHome: true });
    }

    render() {
        if (this.state.fetching) {
            return (<p>loading ...</p>)
        }
        let id = this.state.selectedListId;
        let todoLists = this.state.todoLists;
        let selectedList = todoLists.find(list => list.id === id);
        let isHome = this.state.renderHome;
        let hasLists = this.state.todoLists.length > 0;
        let onEdit = this.state.onEdit;
        let borderClass = this.state.changeEditBorder ? "col-sm-3 fill border-left border-warning" : "col-sm-3 fill border-left";
        return (
            <div className="main-wrapper container-fluid">
                <div className="row">
                    <div className="col-sm-3 border-right menu">
                        <img src={home} onClick={this.isHome} className="cursor-pointer" alt="home logo" /> <strong>toto@gmail.com</strong>
                        <Lists changeList={this.changeList} lists={todoLists} />
                        <ListForm addList={this.addList} />
                        <div className="mt-auto">
                        </div>
                    </div>
                    <div className={onEdit ? "col-sm-5" : "col-sm-7"}>
                        <div className="row">
                            <div className="col-sm">
                                {isHome ? <h1>Prochaines tâches</h1> : hasLists && <h1>{selectedList.title}</h1>}
                            </div>
                            <div className="col-sm-auto">
                                {isHome ? null : hasLists && <button type="button" onClick={this.deleteList} className="btn btn-danger pull-right mr-2"><img src={del} alt="delete logo"></img>&nbsp;Supprimer la liste</button>}
                            </div>
                        </div>
                        {isHome ? <NextTasks lists={todoLists} removeItem={this.removeItem} markTodoDone={this.markTodoDone} addItem={this.addItem} showEditMenu={this.openEditMenu} />
                            : hasLists && <TodoApp id={selectedList.id} initItems={selectedList.tasks} title={selectedList.title} removeItem={this.removeItem} markTodoDone={this.markTodoDone} addItem={this.addItem} showEditMenu={this.openEditMenu} />}
                    </div>
                    {onEdit && <div className={borderClass} >
                        <TodoListItemMenu listId = {id} task={this.state.selectedTask} infoMessage={this.state.changeEditBorder ? "true" : null} onSubmit={this.editTask} onCancelEdit={this.onCancelEdit} />
                    </div>
                    }
                </div>
            </div>
        )
    }
}