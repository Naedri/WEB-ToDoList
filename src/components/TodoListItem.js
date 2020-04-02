import React from 'react';
import delItem from '../assets/delete.svg'

const TodoListItem = (props) => {

    let countTask = () => {
        let total = 0;
        props.item.stages && props.item.stages.forEach(stage => {
            if(stage.done)
                ++total;
        });
        return total;
    }
    let todoClass = props.item.done ?
        "done" : "undone";
    let index = props.item.index;
    return (
        <li className="list-group-item">
            <div className ="form-input row">
            <input type="checkbox" className="col-1 col-sm-1 mt-2" onChange={() => props.markTodoDone(index)} checked={props.item.done} />
            <div className="col-9 col-sm-9">
            <p onClick={() => props.showEditMenu(index)} className={todoClass + " cursor-pointer mb-0"}>{props.item.value}</p>
            <small> {countTask()} sur {(props.item.stages && props.item.stages.length) || "0"} - Echéance {props.item.date} - Note : {props.item.note || ""}</small>
            </div>
            <div className="col-1 col-sm-1">
            <span type="button" onClick={() => props.removeItem(index)} className="btn"><img className="pb-2" src={delItem} alt="remove logo"></img></span>
            </div>
            </div>
        </li>
    );
}

export default TodoListItem;