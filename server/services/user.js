const utils = require("../db/utils"); 
/*const bcrypt = require('bcrypt');*/

module.exports = {
    isFree,
    create,
    authentificate,
    updateEmail,
    updatePwd
};


function isFree(email , callback) {
    const query = 
    `SELECT COUNT(*) 
    FROM USERS
    WHERE EMAIL=$1`;
    
    utils.executeQuery(query, [email], (err, result) => {
    if (err) {
        callback(true, err);
    } else {
        // callback(undefined, result.rows[0]);
        let count = result.row[0];
        let free = (count === '0') ? true : false ; 
        callback(undefined, free);
    }
    });
}


function create( {email,pwd} , callback) {
const query = 
`INSERT INTO USERS (email,encrypted_password)
VALUES ($1, $2);`;
utils.executeQuery(query, [email,pwd], (err, result) => {
    if (err) {
    callback(true, err);
    } else {
    callback(undefined);
    }
});
}

function authentificate(){} ;

function updateEmail(){} ;

function updatePwd(){} ;
