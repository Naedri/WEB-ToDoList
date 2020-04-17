import React from 'react';
import delItem from '../assets/delete.svg'
import { calculateDays } from '../utils/date.js'

const TodoListItem = (props) => {

    const daysLeft = (date) => {
        let days = calculateDays(date);
        if (days === 'Invalid date')
            return 'Aucune échéance définie'
        return days;
    }


    const countTask = () => {
        let total = 0;
        props.item.sousTaches && props.item.sousTaches.forEach(stage => {
            if(stage.fait)
                ++total;
        });
        return total;
    }
    let todoClass = props.item.fait ?
        "done" : "undone";
    let index = props.item.id;
    let listId = props.item.idliste;
    return (
        <li className="list-group-item">
            <div className ="form-input row">
            <input type="checkbox" className="col-1 col-sm-1 mt-2" onChange={() => props.markTodoDone(index,listId)} checked={props.item.fait} />
            <div className="col-9 col-sm-9">
            <p onClick={() => props.showEditMenu(index,listId)} className={todoClass + " cursor-pointer mb-0"}>{props.item.titre}</p>
            <small> {countTask()} sur {(props.item.stages && props.item.stages.length) || "0"} &#183; Echéance : {daysLeft(props.item.echeance)} &#183; Note : {props.item.note || ""}</small>
            </div>
            <div className="col-1 col-sm-1">
            <span type="button" onClick={() => props.removeItem(index,listId)} className="btn"><img className="pb-2" src={delItem} alt="remove logo"></img></span>
            </div>
            </div>
        </li>
    );
}

export default TodoListItem;