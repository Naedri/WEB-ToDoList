import React from 'react';
import plus from '../assets/plus.svg';

export default class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value : ""
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.textInput = null;

    }

    handleChange(event){
        this.setState({value : event.target.value});
    }
    onSubmit() {
        let newItemValue = this.state.value;
        if (newItemValue) {
            this.props.addItem({ newItemValue });
            this.setState({value : ""});
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
            <li className="list-group-item ">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="input-group input-group-lg">
                            <span className="input-group-btn">
                                <span onClick={this.onSubmit} className="btn "><img src={plus} alt="plus logo"></img></span>
                            </span>
                            <input ref={elem => (this.textInput = elem)} type="text" value = {this.state.value} onChange = {this.handleChange} onKeyPress={this.handleKeyPress} className="form-control input-lg mr-2" placeholder="Ajouter une tâche" />
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}