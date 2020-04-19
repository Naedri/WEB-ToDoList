const utils = require("../db/utils"); 
/*const bcrypt = require('bcrypt');*/

module.exports = {
    isFree,
    create,
    authenticate,
    updateEmail,
    updatePwd
};


/** 
 * return a boolean if the email is available
 * @param {*} email 
 * @param {*} callback
 */
function isFree(email , callback) {
    const query = 
        `SELECT COUNT(*) 
        FROM USERS
        WHERE email=$1`;

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
 * return a boolean if the user have been created
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

/**
 * 
 * @param {*} param0 
 * @param {*} callback 
 */
function authenticate( {email,password} , callback){
    const query = 
        `SELECT * 
        FROM USERS
        WHERE email=$1 AND encrypted_password=$2`;
        
    utils.executeQuery(query, [email,password], (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            const userFound = result.rows[0];
            if (userFound){
                delete userFound.encrypted_password;
                callback(undefined, userFound);
            } else {
                //usefull if not server stop
                console.log("incorrect password or email");
                callback(true, userFound);
            }
        }
    });
};

function updateEmail(){} ;

function updatePwd(){} ;
