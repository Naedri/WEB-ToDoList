const utils = require("../../db/utils"); 

module.exports = {
    createResetRequest,
    getResetRequest,
};

//add a new request of reset
function createResetRequest(email, callback) {

    const query = `CALL P_New_Request_email($1);`;

    const query2 = `SELECT request_uuid FROM request WHERE iduser = P_USERS_GET_ID($1);`;

    utils.executeQuery(query, [email], (err, result) => {
        if (err) {
            callback(true, err);
        } else {

            utils.executeQuery(query2, [email], (err2, result2) => {
                if (err2) {
                    callback(true, err2);
                } else {

                    const uuidFound = result2.rows[0];
                    if (uuidFound){
                        callback(undefined, uuidFound);
                    } else {
                        //usefull if not server stop
                        console.log("none uuid found with the given email");
                        callback(true, uuidFound);
                    }

                }
            });

        }
    });
};

//check if we have the request

/** 
 * return a boolean if the email is available
 * @param {*} email 
 * @param {*} callback
 */
function getResetRequest(uuid , callback) {
    const query = 
        `SELECT *
        FROM REQUEST
        WHERE request_uuid=$1;`;

    const query2 = `DELETE FROM request WHERE request_uuid = $1;`;

    const query3 = `SELECT * FROM USERS WHERE IdUser=$1;`;

    let requestFound = {
        result: '',
        email: '',
    }

    //obtaining details from request
    utils.executeQuery(query, [uuid], (err, result) => {
        if (err) {
            callback(true, err);
        } else {
            requestFound.result = result.rows[0];
            console.log(requestFound.result);
            if (requestFound.result){
                console.log("request found with the given uuid");
                
                //deleting request with the given uuid
                utils.executeQuery(query2, [ requestFound.result.request_uuid], (err2, result2) => {
                    if (err2) {
                        callback(true, err2);
                    } else {
                        console.log("request with the given uuid deleted");

                        //getting email from user
                        utils.executeQuery(query3, [requestFound.result.iduser], (err3, result3) => {
                            if (err3) {
                                callback(true, err3);
                            } else {
                                requestFound.email= result3.rows[0].email;
                                callback(undefined, requestFound);
                            }
                        });
                    }
                });
            } else {
                //usefull if not server stop
                console.log("none request found with the given uuid");
                callback(true, requestFound);
            }
        }
    });
};