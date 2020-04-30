//table of requests
const requests = [];

//add a new request of reset
function createResetRequest(resetRequest) {
    requests.push(resetRequest);
}

//check if we have the request
function getResetRequest(id) {
    const thisRequest = requests.find(req => req.id === id);
    return thisRequest;
}

module.exports = {
    createResetRequest,
    getResetRequest,
}