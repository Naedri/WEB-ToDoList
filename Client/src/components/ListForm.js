import React from 'react';
import plus from '../assets/plus.svg';

export default class ListForm extends React.Component {
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
        let newListValue = this.state.value;

        if (newListValue) {
            this.props.addList({ newListValue });
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
            <div className="row">
                <div className="col-sm mt-2">
                    <div className="input-group input-group-sm">
                        <span className="input-group-btn">
                            <span type="button" onClick={this.onSubmit} className="btn btn-sm"><img src={plus} alt="plus logo"></img></span>
                        </span>
                        <input type="text" ref={elem => (this.textInput = elem)} value={this.state.value} onKeyPress={this.handleKeyPress} onChange={this.handleChange} className="form-control input-lg mr-1" placeholder="Ajouter une liste" />
                    </div>
                </div>
            </div>
        )
    }


}
