const utils = require("../../db/utils"); 
const ServiceEmail = require("./email");
const bcrypt = require('bcrypt');

module.exports = {
    isFree,
    create,
    authenticate,
    updateEmail,
    updatePassword,
    sendEmailPwd,
    sendEmailWelcome,
    getDetails,
};

//bcrypt salt rounds
const SALT_ROUNDS = 10; 

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
    
    // On encode le password
    bcrypt.hash(password, SALT_ROUNDS, (err, encryptedPasswordHash) => {
        if (err) {
            callback(true, err);
        } else {

            const hash = encryptedPasswordHash;

            const query = 
            `INSERT INTO USERS (email,encrypted_password)
            VALUES ($1, $2);`;
    
            utils.executeQuery(query, [email,hash], (err, result) => {
                if (err) {
                    callback(true, err);
                } else {
                    let count = result.rowCount;
                    let isInsert = (count > '0') ? true : false ; 
                    callback(undefined, isInsert);
                }
            });

        }
    });
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @param {*} callback 
 */
function authenticate( {email,password} , callback){
    
    const query = 
        `SELECT * 
        FROM USERS
        WHERE email=$1`;
        
    utils.executeQuery(query, [email], (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            const userFound = result.rows[0];
            if (userFound){

                bcrypt.compare(password, userFound.encrypted_password, (err2, result2)=>{
                    if (err2){
                        callback(true, err2);
                    } else {
                        if (result2){
                            console.log("user FOUND with the identifiers");
                            // On retire le password de l'objet user que l'on va retourner afin de pas risquer de l'exposer
                            delete userFound.encrypted_password;
                            callback(undefined, userFound);
                        } else {
                            console.log("NONE user found with the identifiers");
                            callback(true, false);
                        }
                    }
                });


            } else {
                console.log("NONE user found with the identifiers");
                callback(true, false);
            }
        }
    });
};

// update the email of an user with its oldemail
function updateEmail(emailsUser, callback){
    const query="CALL P_USERS_MAIL_UPDATE( P_USERS_GET_ID($1), $2);";
    
    utils.executeQuery(query, [emailsUser.email1,emailsUser.email2], (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            callback(undefined, result);
        }
    });
};

// update the password of an user with its email and old password
function updatePassword(email, password, password2, callback){
    
    const user= {
        iduser: '',
        email: email,
        password: password,
        password2: password2,
    };

    let pwdUpdating = {
        password: '',
        password2: '',
    }

    const query="CALL P_USERS_PWD_UPDATE($1, $2);";

    authenticate(user, (err, result) => {

        if (err) {
            callback(true, err);
        } else {
            let userFound = result;
            if(userFound){
                pwdUpdating.password = true ;
                user.iduser=result.iduser;

                 // On encode le nouveau password
                bcrypt.hash(user.password2, SALT_ROUNDS, (err, encryptedPasswordHash) => {
                    if (err) {
                        callback(true, err);
                    } else {

                        const hash = encryptedPasswordHash;

                        utils.executeQuery(query, [user.iduser,hash], (err2, result2) => {
                            if (err) {
                                callback(true, err2);
                            } else {
                                pwdUpdating.password2 =true ;
                                callback(undefined, pwdUpdating);
                            }
                        });
                    }
                });
            } else {
                pwdUpdating.password = false ;
                callback(undefined, pwdUpdating);
            }
        }
    });
};

// return all details of an user found with its email
function getDetails(email, callback){
    const query = 
    `SELECT * 
    FROM USERS
    WHERE email=$1`;

    utils.executeQuery(query, [email], (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            const userFound = result.rows[0];
            if (userFound){
                //delete userFound.encrypted_password;
                callback(undefined, userFound);
            } else {
                //usefull if not server stop
                console.log("none user found with the given email");
                callback(true, userFound);
            }
        }
    });
};

// send an email with the pwd to a given user email
function sendEmailPwd(email , callback){

    getDetails(email, (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            const user = result ;
            console.log(user);

            const subject = "Reminder of your details of ToDoList App";
            const mail = user.email;
            const pwd = user.encrypted_password;
            const text = ServiceEmail.generateText_Pwd(mail,pwd);
            const html = ServiceEmail.generateHtml_Pwd(mail,pwd);

            const emailDetails = {
                to: mail,
                subject: subject,
                text: text,
                html: html,
            };
            
            ServiceEmail.sendEmail( emailDetails, (err2, result2) => {
                if (err2) {
                    console.log("ERROR sendMail from user.js");
                    console.log(err2);
                    callback(true, err2);
                } else {
                    console.log("NO ERROR sendMail from user.js");
                    console.log(result2);
                    const info = result2;
                    callback(undefined, info);
                }
            });
        }
    });
};


// send an email with the pwd to a given user email
function sendEmailWelcome(email , callback){

    getDetails(email, (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            const user = result ;
            console.log(user);

            const subject = "Welcome on Board of ToDoList App";
            const mail = user.email;
            const pwd = user.encrypted_password;
            const text = ServiceEmail.generateText_Welcome(mail,pwd);
            const html = ServiceEmail.generateHtml_Welcome(mail,pwd);

            const emailDetails = {
                to: mail,
                subject: subject,
                text: text,
                html: html,
            };
            
            ServiceEmail.sendEmail( emailDetails, (err2, result2) => {
                if (err2) {
                    console.log("ERROR sendMail from user.js");
                    console.log(err);
                    callback(true, err2);
                } else {
                    console.log("NO ERROR sendMail from user.js");
                    console.log(err);
                    const info = result2;
                    callback(undefined, info);
                }
            });
        }
    });
};