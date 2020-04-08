import React, { useState } from 'react';
import plus from '../assets/plus.svg';


const StagesForm = (props) => {
    let [value, setValue] = useState("");
    let textInput = null;

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    const onSubmit = () => {
        let newStageValue = value;

        if (newStageValue) {
            props.onSubmit({ newStageValue });
            setValue("");
        }
        textInput.focus();
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSubmit()
        }
    }

        return (
            <div className="input-group mb-3">
                <input type="text" ref={elem => (textInput = elem)} value={value} onKeyPress={handleKeyPress} onChange={handleChange} className="form-control mr-1" placeholder="Ajouter une étape ..." />
                <div className="input-group-append">
                    <span type="button" onClick={onSubmit} className="input-group-text"><img src={plus} alt="plus logo"></img></span>
                </div>
            </div>
        )
}


export default StagesForm;


/*
<div>
    <div className="input-group mb-3">
        <div className="input-group-prepend">
            <div className="input-group-text">
                <input type="checkbox" onChange={() => props.markTodoDone(index)} checked={props.item.done} />
            </div>
        </div>
        <input type="text" readOnly value={props.item.title} className="form-control" />
        <div className="input-group-append">
            <span onClick={() => props.removeStage(index)} className="input-group-text"><img src={remove} alt="remove logo"></img></span>
        </div>
    </div>
</div>*/