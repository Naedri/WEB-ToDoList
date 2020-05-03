//table of requests
const requests = [];

module.exports = {
    createResetRequest,
    getResetRequest,
}

//add a new request of reset
function createResetRequest(resetRequest, callback) {
    requests.push(resetRequest);
}

//check if we have the request
function getResetRequest(id, callback) {
    const thisRequest = requests.find(req => req.id === id);
    return thisRequest;
}