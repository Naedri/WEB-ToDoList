import React from 'react';
import StagesItem from './StagesItem';
import StagesForm from './StagesForm';


export default class TodoListItemMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.task.titre || "",
            note: this.props.task.note || "",
            date: this.props.task.echeance || "",
            stages: this.props.task.sousTaches || [],
            showError: this.props.infoMessage || false
        };
        this.nameInput = null;
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.infoMessage !== prevProps.infoMessage) {
            this.setState({ showError: this.props.infoMessage });
            this.nameInput.focus();
        }
    }

    componentDidMount = () => {
        this.nameInput.focus();
    }

    removeStage = (index) => {
        let stages = this.state.stages;
        let newStages = stages.filter(stage => stage.id !== index);
        this.setState({ stages: newStages })
    }

    onSubmit = () => {
        let newTask = {
            id : this.props.task.id,
            idliste : this.props.task.idliste,
            titre: this.state.title || this.props.task.value,
            echeance: this.state.date,
            note : this.state.note,
            fait: this.props.task.fait,
            sousTaches : this.props.task.sousTaches
        }
        this.props.onSubmit(newTask, this.props.task.idliste);
    }

    markStageDone = (index) => {
        this.setState({
            stages: this.state.stages.map(stg => (stg.id === index ? { ...stg, fait: !stg.fait } : stg)),
            showError: false
        });
    }

    createTask = (task) => {
        let newtask = { titre: task.newStageValue, id: this.state.stages.length + 1 + task.newStageValue, fait: false };
        this.setState({
            stages: [...this.state.stages, newtask],
            showError: false
        });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value, showError: false });
    }

    render = () => {
        let stages = this.state.stages.length > 0 && this.state.stages.map(stage => {
            return (
                <StagesItem key={stage.id + stage.titre} item={stage} removeStage={this.removeStage} markTodoDone={this.markStageDone} />
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
                    <button type="button" ref={input => this.nameInput = input} onClick={this.onSubmit} className="btn btn-secondary ml-2">Enregistrer</button>
                    <button type="button" onClick={this.props.onCancelEdit} className="btn btn-danger ml-2">Annuler</button>
                </div>
                {this.props.infoMessage && <p className="error">Veuillez enregistrer vos modifications</p>}
            </div>
        );
    }
}