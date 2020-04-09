export const BASE_URL = 'http://localhost:8001'

function getEndpointURL(endpoint) {
    return `${BASE_URL}${endpoint}`
}

export async function getLists() {
    let url = getEndpointURL('/lists')
    let response = await fetch(url)

    // 👉 Parser la réponse en JSON
    let data = await response.json()
    // 👉 Renvoyer les données
    return data
}

export async function createList(list) {
    let url = getEndpointURL('/lists')
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(list)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    if (response.status >= 300) {
        throw new Error(data.message)
    }

    // 👉 Renvoyer les données
    return data
}

export async function deletelist(list) {
    // 👉 Faire une requête DELETE sur l'URL
    // http://localhost:3000/posts/{id du post} grâce à fetch
    // (cf https://slides.com/drazik/programmation-web-client-riche-la-programmation-asynchrone-en-js#/25)
    let url = getEndpointURL(`/list/${list.id}`)
    await fetch(url, {
        method: 'DELETE',
    })
}

export async function createTask(list, task) {
    let url = getEndpointURL(`/list/${list.id}`)
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    // 👉 Renvoyer les données
    return data
}

export async function deleteTaskAPI(list, task) {
    console.log(task.index);
    let url = getEndpointURL(`/lists/${list.id}/tasks/${task.index}`)
    await fetch(url, {
        method: 'DELETE',
    })
}

export async function getList(list) {
    let url = getEndpointURL(`/lists/${list.id}`)
    let response = await fetch(url)

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    // 👉 Renvoyer les données
    return data
}

export async function editTaskAPI(list, task) {
    console.log(task);
    let url = getEndpointURL(`/lists/${list.id}/${task.index}`);
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });

    // 👉 Parser la réponse en JSON
    let data = await response.json()

    // 👉 Renvoyer les données
    return data
}