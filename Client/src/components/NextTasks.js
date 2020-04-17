import React from 'react';
import TodoListItem from './TodoListItem'


const NextTasks = (props) => {

    let tasks = props.lists.map(list => list.taches.map(task => task));
    tasks = Array.prototype.concat(...tasks).filter(task => task.echeance !== null).sort((a, b) => new Date(a.date) - new Date(b.date));
    const Nexts = tasks.map(task => {
        return <TodoListItem key={task.id + task.titre} listId={task.idListe} item={task} removeItem={props.removeItem} markTodoDone={props.markTodoDone} showEditMenu={props.showEditMenu} />
    }) 
    let hasTasks = tasks.length > 0;
    return (
        <div>
            {hasTasks ? 
            <ul className="list-group-flush pt-2" >
                {Nexts}
            </ul> : <p>Aucune tâche ou aucune échéance définie</p>}
        </div>
    )



}


export default NextTasks;