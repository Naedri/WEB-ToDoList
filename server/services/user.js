const utils = require("../db/utils"); 
/*const bcrypt = require('bcrypt');*/

module.exports = {
createUser,
isFree,
updatePassword,
updateMail
};

function createUser( {email,pwd} , callback) {
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

function updatePassword(){} ;

function updateMail(){} ;

function isFree(email , callback) {
    const query = 
    `SELECT COUNT(*) 
    FROM USERS
    WHERE mail=$1`;
    utils.executeQuery(query, [email], (err, result) => {
    if (err) {
        callback(true, err);
    } else {
        callback(undefined, result.rows[0]);
    }
    });
}