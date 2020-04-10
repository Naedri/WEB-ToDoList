import React from 'react'
import TodoList from './TodoList';

const TodoApp = (props) => {

    return (
        <div className="container mt-3">
            <TodoList listId={props.id} showEditMenu={props.showEditMenu} items={props.initItems} removeItem={props.removeItem} markTodoDone={props.markTodoDone} addItem={props.addItem} />
        </div>
    );

}

export default TodoApp;