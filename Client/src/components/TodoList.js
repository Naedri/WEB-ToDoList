import TodoListItem from './TodoListItem';
import TodoForm from './TodoForm';
import React from 'react';

const TodoList = (props) => {

    const addItem = (newItem) => {
        props.addItem(newItem, props.listId);
    }
    let items = props.items.map(task => {
        return (
            <TodoListItem key={task.id + task.titre} item={task}
                removeItem={props.removeItem} markTodoDone={props.markTodoDone} showEditMenu={props.showEditMenu} />
        );
    });
    return (
        <ul className="list-group-flush pt-2">
            {items}
            <TodoForm addItem={addItem} />
        </ul>
    );
}


export default TodoList;
