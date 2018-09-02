const initialState = {
    show: false
}

const loading = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_LOADING': {
            return {
                ...state,
                show: true
            }
        }
        case 'HIDING_LOADING': {
            return {
                ...state,
                show: false
            }
        }
        default:
            return state
    }
}

export default loading