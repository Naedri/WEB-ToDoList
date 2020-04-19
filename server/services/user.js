const utils = require("../db/utils"); 
/*const bcrypt = require('bcrypt');*/

module.exports = {
    isFree,
    create,
    authentificate,
    updateEmail,
    updatePwd
};


/** 
 * 
 * @param {*} email 
 * @param {*} callback will recieve 'true' if user is available
 */
function isFree(email , callback) {
    const query = 
    `SELECT COUNT(*) 
    FROM USERS
    WHERE EMAIL=$1`;
    
    utils.executeQuery(query, [email], (err, result) => {
    if (err) {
        callback(true, err);
    } else {
        let count = result.rows[0].count;
        let isFree = (count === '0') ? true : false ; 
        callback(undefined, isFree);
    }
    });
}

/**
 * 
 * @param {*} param0 
 * @param {*} callback 
 */
function create( {email,password} , callback) {
const query = 
`INSERT INTO USERS (email,encrypted_password)
VALUES ($1, $2);`;
utils.executeQuery(query, [email,password], (err, result) => {
    if (err) {
        callback(true, err);
    } else {
        let count = result.rowCount;
        let isInsert = (count > '0') ? true : false ; 
        callback(undefined, isInsert);
    }
});
}

function authentificate(){} ;

function updateEmail(){} ;

function updatePwd(){} ;
