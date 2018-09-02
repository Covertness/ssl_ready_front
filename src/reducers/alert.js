const initialState = {
    show: false,
    title: '',
    content: ''
}

const alert = (state = initialState, action) => {
    switch (action.type) {
        case 'CHECK_DOMAIN': {
            if (action.result.status !== 0) {
                return alertMessage('Error', `The domain ${action.domain} is invalid. 
                                     Please make sure its CNAME is correct.`, state)
            } else return state
        }
        case 'ALERT_MESSAGE': {
            return alertMessage(action.title, action.content, state)
        }
        case 'HIDING_ALERT': {
            return {
                ...state,
                show: false
            }
        }
        default:
            return state
    }
}

function alertMessage(title, content, state) {
    return {
        ...state,
        show: true,
        title: title,
        content: content
    }
}

export default alert