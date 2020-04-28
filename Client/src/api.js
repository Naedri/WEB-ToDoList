export const BASE_URL = 'http://localhost:8000'

/* general functions ****************************/

function getEndpointURL(endpoint) {
    return `${BASE_URL}${endpoint}`
}

function getHeaders() {
    let headers = { 'Content-Type': 'application/json' };
    let token = JSON.parse(localStorage.getItem('token'));
    if (token)
        headers.Authorization = `Bearer ${token}`
    return headers;
}
/* list and task functions ****************************/

export async function getLists(email) {
    let url = getEndpointURL(`/api/everything/${email}`)
    let response = await fetch(url, {
        headers: getHeaders()
    })
    // 👉 Parser la réponse en JSON
    let listes = await response.json()
    // 👉 Renvoyer les données
    let stages = await getAllStages();
    // intégration des sous taches
    for (let i = 0; i < stages.length; ++i) {
        for (let j = 0; j < listes.length; ++j) {
            let tache = listes[j].taches.find(tache => tache.id === stages[i].idtache)
            if (tache)
                tache.sousTaches.push(stages[i])
        }
    }
    return listes
}

export async function createList(list) {
    let url = getEndpointURL('/api/lists')
    let response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(list)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message)
    }
    console.log(data);
    // 👉 Renvoyer les données
    return data
}

export async function deletelist(list) {
    // 👉 Faire une requête DELETE sur l'URL
    // http://localhost:3000/posts/{id du post} grâce à fetch
    // (cf https://slides.com/drazik/programmation-web-client-riche-la-programmation-asynchrone-en-js#/25)
    let url = getEndpointURL(`/api/lists/${list.id}`)
    await fetch(url, {
        method: 'DELETE',
        headers:
            getHeaders()

    })
}

export async function createTask(list, task) {
    let url = getEndpointURL(`/api/tache`)
    let toSend = { ...task, idListe: list.id }
    let response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(toSend)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()
    console.log(data);
    // 👉 Renvoyer les données
    return data
}

export async function deleteTaskAPI(idTache) {
    let url = getEndpointURL(`/api/tache/${idTache}`)
    await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
    })
}

export async function getList(list) {
    let url = getEndpointURL(`/lists/${list.id}`)
    let response = await fetch(url, {
        headers: getHeaders()
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    // 👉 Renvoyer les données
    return data
}

export async function editTaskAPI(task) {
    let url = getEndpointURL(`/api/tache/${task.id}`);
    let response = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(task)
    });
    // 👉 Parser la réponse en JSON
    let data = await response.json();
    // 👉 Renvoyer les données
    return data
}

async function getAllStages() {
    let url = getEndpointURL('/api/soustache')
    let response = await fetch(url, {
        headers: getHeaders(),
    });
    // 👉 Parser la réponse en JSON
    let stages = await response.json()
    // 👉 Renvoyer les données
    return stages
}

export async function editStageApi(stage) {
    let url = getEndpointURL(`/api/soustache/${stage.id}`);
    let toSend = { fait: stage.fait }
    let response = await fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(toSend)
    });

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    // 👉 Renvoyer les données
    return data
}

export async function createStageApi(stage) {
    console.log(stage);
    let url = getEndpointURL(`/api/soustache`)
    let response = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(stage)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()
    console.log(data);
    // 👉 Renvoyer les données
    return data
}

export async function deleteStageApi(stage) {
    let url = getEndpointURL(`/api/soustache/${stage.id}`)
    await fetch(url, {
        method: 'DELETE',
        headers: getHeaders()
    })
}


/* user functions ****************************/

/**
 * does an email is already used
 * @param {*} email 
 */
export async function isFreeUserApi(email) {
    let url = getEndpointURL('/api/user/free')
    let user = {
        email: email
    };
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message)
    }

    // 👉 Renvoyer les données
    return data;
}


/**
 * creation of a user with an email and its encrypted password
 * @param {*} email 
 * @param {*} password 
 */
export async function createUserApi(email, password) {
    let url = getEndpointURL('/api/user/signup')
    let user = {
        email: email,
        password: password,
    };
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    // 👉 Parser la réponse en JSON
    let data = await response.json();

    if (response.status >= 300) {
        throw new Error(data.message)
    }
    // 👉 Renvoyer les données
    return data
}

/**
 * authentification of a user with its email and its encrypted password
 * @param {*} email 
 * @param {*} password 
 */
export async function authenticateUserApi(email, password) {
    let url = getEndpointURL('/api/user/login');
    let user = {
        email: email,
        password: password,
    };
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    // 👉 Parser la réponse en JSON
    let data = await response.json()


    // bad login details
    if (response.status === 403) {
        data = false;
        return data;
    }

    if (response.status >= 300) {
        throw new Error(data.message)
    }

    // 👉 Renvoyer les données
    return data
}


/**
 * logout of an user
 * @param {*} email 
 * @param {*} password 
 */
export async function quitSessionUserApi(email, password) {
    let url = getEndpointURL('/api/user/logout');
    let user = {
        email: email,
        password: password,
    };
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message);
    }

    // 👉 Renvoyer les données
    return data;
}


/**
 * ask to send an email to the given adress
 * @param {*} email 
 */
export async function forgetPwdUserApi(email) {
    let url = getEndpointURL('/api/user/forgetpassword')
    let user = {
        email: email,
    };
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message)
    }

    // 👉 Renvoyer les données
    return data
}

/**
 * update of the email of a user
 * autentificate with its email and its encrypted password (the current one )
 * user should contain ass well another email (the new)
 * @param {*} email 
 * @param {*} password 
 * @param {*} email2
 */
export async function updateEmailUserApi(email, password, email2) {
    let url = getEndpointURL('/api/user/update/email')
    let user = {
        email: email,
        password: password,
        email2: email2,
    };
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message)
    }

    // 👉 Renvoyer les données
    return data
}


/**
 * update of the password of a user
 * autentificate with its email and its encrypted password (the current one = old)
 * user should contain ass well another encrypted password (the new)
 * it is more safe to ask to send both password (old and new)
 * @param {*} email 
 * @param {*} password 
 * @param {*} password2
 */
export async function updatePwdUserApi(email, password, password2) {
    let url = getEndpointURL('/api/user/update/password')
    let user = {
        email: email,
        password: password,
        password2: password2,
    };
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message)
    }

    // 👉 Renvoyer les données
    return data
}