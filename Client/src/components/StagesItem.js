import React from 'react';
import remove from '../assets/remove.svg'

const StagesItem = (props) => {
    let id = props.item.id;
    let todoClass = props.item.fait ?
        "done" : "undone";
    return (
        <li className="list-group-item ">
            <div className="form-row">
                <input type="checkbox" className="col-1 col-sm-1" onChange={() => props.markTodoDone(id)} checked={props.item.fait} />
                <div className="col">
                    <article className={todoClass + " pl-2"} >{props.item.titre}</article>
                </div>
                    <span onClick={() => props.removeStage(id)} className="btn"><img className="mb-2" src={remove} alt="remove logo"></img></span>
            </div>
        </li>
    );
}

export default StagesItem;





