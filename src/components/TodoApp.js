import React from 'react'
import TodoList from './TodoList';

const TodoApp = (props) => {

    const addItem = (todoItem) => {
        props.addItem(todoItem, props.id);
    }
    const removeItem = (itemIndex) => {
        props.removeItem(itemIndex, props.id);
    }

    const markTodoDone = (itemIndex) => {
        props.markTodoDone(itemIndex, props.id)
    }
    return (
        <div className="container mt-3">
            <TodoList showEditMenu={props.showEditMenu} items={props.initItems} removeItem={removeItem} markTodoDone={markTodoDone} addItem={addItem} />
        </div>
    );

}

export default TodoApp;