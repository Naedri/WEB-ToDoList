import React, { useState } from 'react';
import plus from '../assets/plus.svg';


const TodoForm = (props) => {
    let [value, setValue] = useState("");
    let textInput = null;

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    const onSubmit = () => {
        let newItemValue = value;
        if (newItemValue) {
            props.addItem({ newItemValue });
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
        <li className="list-group-item ">
            <div className="row">
                <div className="col-lg-12">
                    <div className="input-group input-group-sm">
                        <span className="input-group-btn">
                            <span onClick={onSubmit} className="btn "><img src={plus} alt="plus logo"></img></span>
                        </span>
                        <input ref={elem => (textInput = elem)} type="text" value={value} onChange={handleChange} onKeyPress={handleKeyPress} className="form-control input-lg mr-2" placeholder="Ajouter une tâche" />
                    </div>
                </div>
            </div>
        </li>
    );
}

export default TodoForm;