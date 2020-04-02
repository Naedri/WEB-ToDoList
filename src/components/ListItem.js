import React from 'react';


const ListItem = (props) => {

    const {onClick, list} = props
    let countLeft = () => {
        let total = 0;
        for (let i = 0; i < list.tasks.length; ++i) {
            if (!list.tasks[i].done)
                ++total;
        }
        return total;
    }

    return (
        <li onClick={() => onClick(list.id)} className="d-flex justify-content-between align-items-center p-2 cursor-pointer">
            {list.title}
            <span className="badge badge-primary badge-pill">{countLeft()}</span>
        </li>
    )
}


export default ListItem