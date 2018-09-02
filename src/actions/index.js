import fetch from 'cross-fetch'

export const checkDomain = (domain) => {
    return dispatch => {
        dispatch({ type: 'SHOW_LOADING' })
        return postData('//' + process.env.REACT_APP_API_URL + '/domains/check', {
            source_host: domain
        }).then(response => {
            return response.json()
        }).then(json => {
            dispatch({
                type: 'CHECK_DOMAIN',
                domain,
                result: json,
                receivedAt: Date.now()
            })
            dispatch({ type: 'HIDING_LOADING' })
        })
    }
}

export const alertMessage = (title, content) => ({
    type: 'ALERT_MESSAGE',
    title,
    content
})

export const hideAlert = () => ({
    type: 'HIDING_ALERT'
})

export const backConnectDomain = () => ({
    type: 'BACK_CONNECT_DOMAIN'
})

export const createDomain = (domain, address) => {
    return dispatch => {
        dispatch({ type: 'SHOW_LOADING' })
        return postData('//' + process.env.REACT_APP_API_URL + '/domains', {
            source_host: domain,
            dest_host: address
        }).then(response => {
            dispatch({ type: 'HIDING_LOADING' })
            if (response.status !== 201) {
                return Promise.reject({ httpCode: response.status })
            }
            return response.json()
        }).then(json => {
            dispatch({
                type: 'CREATE_DOMAIN',
                result: json,
                receivedAt: Date.now()
            })
        }).catch(error => {
            if (error.httpCode === 409) {
                dispatch(alertMessage('Error', `The domain has exist.`))
            } else {
                dispatch(alertMessage('Error', `Network error, code: ${error.httpCode}`))
            }
        })
    }
}

export const fetchDomain = (id) => {
    return dispatch => {
        dispatch({ type: 'SHOW_LOADING' })
        return getData('//' + process.env.REACT_APP_API_URL + '/domains/' + id).then(response => {
            dispatch({ type: 'HIDING_LOADING' })
            if (response.status !== 200) {
                return Promise.reject({ httpCode: response.status })
            }
            return response.json()
        }).then(json => {
            dispatch({
                type: 'FETCH_DOMAIN',
                result: json,
                receivedAt: Date.now()
            })
        }).catch(error => {
            dispatch(alertMessage('Error', `Network error, code: ${error.httpCode}`))
        })
    }
}


function getData(url = ``) {
    // Default options are marked with *
    return fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Accept": "application/json"
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    })
}

function postData(url = ``, data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
}