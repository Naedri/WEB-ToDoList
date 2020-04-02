import React from 'react';
import plus from '../assets/plus.svg';

export default class StagesForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.textInput = null;
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    onSubmit() {
        let newStageValue = this.state.value;

        if (newStageValue) {
            this.props.onSubmit({ newStageValue });
            this.setState({ value: "" });
        }
        this.textInput.focus();
    }
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.onSubmit()
        }
    }
    render() {
        return (
            <div className="input-group mb-3">
                <input type="text" ref={elem => (this.textInput = elem)} value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} className="form-control mr-1" placeholder="Ajouter une étape ..." />
                <div className="input-group-append">
                    <span type="button" onClick={this.onSubmit} className="input-group-text"><img src={plus} alt="plus logo"></img></span>
                </div>
            </div>
        )
    }
}
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