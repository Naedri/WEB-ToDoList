import React from 'react';
import remove from '../assets/remove.svg'

const StagesItem = (props) => {
    let index = props.item.index;
    let todoClass = props.item.done ?
        "done" : "undone";
    return (
        <li className="list-group-item ">
            <input type="checkbox" onChange={() => props.markTodoDone(index)} checked={props.item.done} />
            <span className={todoClass + " pl-2"} >{props.item.title}</span>
            <span onClick={() => props.removeStage(index)} className="btn float-right"><img className="pb-3" src={remove} alt="remove logo"></img></span>
        </li>
    );
}

export default StagesItem;





