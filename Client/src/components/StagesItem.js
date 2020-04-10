import React from 'react';
import remove from '../assets/remove.svg'

const StagesItem = (props) => {
    let index = props.item.index;
    let todoClass = props.item.done ?
        "done" : "undone";
    return (
        <li className="list-group-item ">
            <div className="form-input row">
                <input type="checkbox" className="col-1 col-sm-1" onChange={() => props.markTodoDone(index)} checked={props.item.done} />
                <div className="col-6 col-sm-6">
                    <span className={todoClass + " pl-2"} >{props.item.title}</span>
                </div>
                <div className="col-1 col-sm-1">
                    <span onClick={() => props.removeStage(index)} className="btn"><img className="pb-3" src={remove} alt="remove logo"></img></span>
                </div>
            </div>
        </li>
    );
}

export default StagesItem;





