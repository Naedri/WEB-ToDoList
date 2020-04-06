import React from 'react';
import StagesItem from './StagesItem';
import StagesForm from './StagesForm';


export default class TodoListItemMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.task.value || "",
            note: this.props.task.note || "",
            date: this.props.task.date || "",
            stages: this.props.task.stages || [],
            showError: this.props.infoMessage || false
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.createTask = this.createTask.bind(this);
        this.markStageDone = this.markStageDone.bind(this);
        this.removeStage = this.removeStage.bind(this);
        this.baseState = this.state;
    }

    componentDidUpdate(prevProps) {
        if (this.props.infoMessage !== prevProps.infoMessage) {
            this.setState({ showError: this.props.infoMessage });
        }
    }

    removeStage(index) {
        let stages = this.state.stages;
        let newStages = stages.filter( stage => stage.index !== index);
        this.setState({stages : newStages})
    }

    onSubmit() {
        let newTask = {
            value: this.state.title || this.props.task.value,
            note: this.state.note,
            date: this.state.date,
            stages: this.state.stages,
            index: this.props.task.index,
            done: this.props.task.done
        }
        this.props.onSubmit(newTask);
    }

    markStageDone(index) {
        this.setState({
            stages: this.state.stages.map(stg => (stg.index === index ? {...stg, done : !stg.done} : stg)),
            showError:false
          });
    }

    createTask(task) {
        let newtask = { title: task.newStageValue, index: this.state.stages.length + 1+task.newStageValue, done: false };
        this.setState({
            stages:[...this.state.stages, newtask],
            showError : false
          });   
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value, showError: false });
    }
    
    render() {
        let stages = this.state.stages.length > 0 && this.state.stages.map(stage => {
            return (
                <StagesItem key={stage.index + stage.title} item={stage} removeStage={this.removeStage} markTodoDone={this.markStageDone} />
            );
        });
        return (
            <div className="form-group">
                <label>Titre</label>
                <input type="text" onChange={this.handleChange} className="form-control mb-3" name="title" value={this.state.title} />
                <label>Etapes</label>
                <ul className="list-group-flush">
                    {stages}
                    <StagesForm onSubmit={this.createTask} />
                </ul>
                <label htmlFor="Echeance">Echéance</label>
                <input type="date" onChange={this.handleChange} value={this.state.date} name="date" className="form-control mb-3" />
                <label>Notes</label>
                <textarea type="text" onChange={this.handleChange} value={this.state.note} name="note" className="form-control mb-3" placeholder="Quelques détails ..." />
                <div className="row">
                    <button type="button" ref={input => input && this.state.showError && input.focus()} onClick={this.onSubmit} className="btn btn-secondary ml-2">Enregistrer</button>
                    <button type="button" onClick={this.props.onCancelEdit} className="btn btn-danger ml-2">Annuler</button>
                </div>
                {this.props.infoMessage && <p className="error">Veuillez enregistrer vos modifications</p>}
            </div>
        );
    }
}