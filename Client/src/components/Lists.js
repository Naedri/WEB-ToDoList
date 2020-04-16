import React from 'react';
import ListItem from './ListItem'

const Lists = (props) => {

    let lists = props.lists.map(list => {
        return (
            <ListItem onClick={props.changeList} key={list.id} list={list} />
        )
    });
    return (
        <ul className="list-group pt-2">
            <h5>Mes listes </h5>
            {lists}
        </ul>

    )
}

export default Lists;