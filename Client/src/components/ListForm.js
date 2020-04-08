import React, { useState } from 'react';
import plus from '../assets/plus.svg';


const ListForm = (props) => {
    let [value, setValue] = useState("");
    let textInput = null;

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    const onSubmit = () => {
        if (value) {
            props.addList({ value });
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
        <div className="row">
            <div className="col-sm mt-2">
                <div className="input-group input-group-sm">
                    <span className="input-group-btn">
                        <span type="button" onClick={onSubmit} className="btn btn-sm"><img src={plus} alt="plus logo"></img></span>
                    </span>
                    <input type="text" ref={elem => (textInput = elem)} value={value} onKeyPress={handleKeyPress} onChange={handleChange} className="form-control input-lg mr-1" placeholder="Ajouter une liste" />
                </div>
            </div>
        </div>
    )

}

export default ListForm;