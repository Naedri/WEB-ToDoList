import TodoListItem from './TodoListItem';
import TodoForm from './TodoForm';
import React from 'react';

const TodoList = (props) => {
    let items = props.items.map(task => {
        return (
            <TodoListItem key={task.index} item={task} removeItem={props.removeItem} markTodoDone={props.markTodoDone} showEditMenu={props.showEditMenu} />
        );
    });
    return (
        <ul className="list-group-flush pt-2">
            {items}
            <TodoForm addItem={props.addItem} />
        </ul>
    );
}


export default TodoList;
