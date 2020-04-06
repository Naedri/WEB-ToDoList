import React, { Component } from "react";
import TodoApp from './components/TodoApp';
import Lists from './components/Lists'
import ListForm from './components/ListForm';
import TodoListItemMenu from './components/TodoListItemMenu'
import home from './assets/home.svg';
import del from './assets/delete-forever.svg';
//import settings from './assets/settings.svg';
import data from './test_data/fake_data.json';


export default class Home extends Component {


    constructor(props) {
        super(props);
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
            todoLists: data.lists,
            selectedList: data.lists[0],
            onEdit: false,
            selectedTask: {},
            changeEditBorder: false,
            renderHome: true
        };
    }


    deleteList() {
        if (window.confirm(`Attention cette action est irreversible, êtes vous sur de vouloir supprimer la liste ${this.state.selectedList.title}?`)) {
            let todoLists = this.state.todoLists
            let id = this.state.selectedList.id;
            let index = this.findList(id);
            todoLists.splice(index, 1);
            this.setState({ todoLists: todoLists, selectedList: data.lists[0], onEdit: false });
        }
    }

    findList(id) {
        for (let i = 0; i < this.state.todoLists.length; ++i) {
            if (this.state.todoLists[i].id === id)
                return i;
        }
    }
    changeList(id) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        let index = this.findList(id)
        let list = this.state.todoLists[index];
        this.setState({ selectedList: list, onEdit: false, renderHome: false });
    }

    editTask(newTask) {
        console.log(newTask)
        let todoLists = this.state.todoLists
        let id = this.findList(this.state.selectedList.id);
        for (var i = 0; i < todoLists[id].tasks.length; i++){
            if (todoLists[id].tasks[i].index === newTask.index) {
                todoLists[id].tasks[i] = newTask;
                break;
            }
        }
        this.setState({ todoLists: todoLists, onEdit: false });
    }

    addList(list) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        let todoLists = this.state.todoLists
        todoLists.push({
            id: todoLists.length + 1,
            title: list.newListValue,
            tasks: []
        })
        let index = this.findList(todoLists.length);
        this.setState({ todoLists: todoLists, selectedList: data.lists[index], renderHome: false });
    }

    openEditMenu(index) {//plutot mettre id list et id task
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        let selectedList = this.state.selectedList
        this.setState({ changeEditBorder: false });
        for (var i = 0; i < selectedList.tasks.length; i++)
            if (selectedList.tasks[i].index === index) {
                this.setState({ selectedTask: selectedList.tasks[i] })//get task par l'api
                break;
            }
        this.setState({ onEdit: true })
    }

    onCancelEdit() {
        this.setState({ onEdit: false });
    }

    addItem(todoItem, id) {
        let todoLists = this.state.todoLists
        id = this.findList(id);
        todoLists[id].tasks.push({
            index: todoLists[id].tasks.length + 1,
            value: todoItem.newItemValue,
            done: false
        });
        this.setState({ todoLists: todoLists });
    }
    removeItem(itemIndex, id) {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        let todoLists = this.state.todoLists
        id = this.findList(id);
        for (var i = 0; i < todoLists[id].tasks.length; i++)
            if (todoLists[id].tasks[i].index === itemIndex) {
                todoLists[id].tasks.splice(i, 1);
                break;
            }
        this.setState({ todoLists: todoLists });
    }
    markTodoDone(itemIndex, id) {
        let todoLists = this.state.todoLists
        id = this.findList(id);
        let todo = todoLists[id].tasks.find(task => task.index === itemIndex);
        todo.done = !todo.done;
        this.setState({ todoLists: todoLists });
    }

    isHome() {
        if (this.state.onEdit) {
            this.setState({ changeEditBorder: true });
            return;
        }
        this.setState({ renderHome: true });
    }
    render() {
        let isHome = this.state.renderHome;
        let hasLists = this.state.todoLists.length > 0;
        let onEdit = this.state.onEdit;
        let borderClass = this.state.changeEditBorder ? "col-sm-3 fill border-left border-warning" : "col-sm-3 fill border-left";
        return (
            <div className="main-wrapper container-fluid">
                <div className="row">
                    <div className="col-sm-3 border-right menu">
                        <img src={home} onClick={this.isHome} className="cursor-pointer" alt="home logo" /> <strong>toto@gmail.com</strong>
                        <Lists changeList={this.changeList} lists={this.state.todoLists} />
                        <ListForm addList={this.addList} />
                        <div className = "mt-auto">
                        </div>
                    </div>
                    <div className={onEdit ? "col-sm-5" : "col-sm-7"}>
                        <div className="row">
                            <div className="col-sm">
                                {isHome ? <h1>Prochaines tâches</h1> : hasLists && <h1>{this.state.selectedList.title}</h1>}
                            </div>
                            <div className="col-sm-auto">
                                {isHome ? null : hasLists && <button type="button" onClick={this.deleteList} className="btn btn-danger pull-right mr-2"><img src={del} alt="delete logo"></img>&nbsp;Supprimer la liste</button>}
                            </div>
                        </div>
                        {isHome ? null : hasLists && <TodoApp id={this.state.selectedList.id} initItems={this.state.selectedList.tasks} title={this.state.selectedList.title} removeItem={this.removeItem} markTodoDone={this.markTodoDone} addItem={this.addItem} showEditMenu={this.openEditMenu} />}
                    </div>
                    {onEdit && <div className={borderClass} >
                        <TodoListItemMenu task={this.state.selectedTask} infoMessage={this.state.changeEditBorder ? "true" : null} onSubmit={this.editTask} onCancelEdit={this.onCancelEdit} />
                    </div>
                    }
                </div>
            </div>
        )
    }
}