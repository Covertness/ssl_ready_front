const initialState = {
    sourceHost: '',
    valid: true,
    connect: {
        activeStep: 0
    },
    detail: {
        id: 0,
        state: '',
        sourceHost: '',
        destHost: '',
        renewalDate: '',
        flux: {
            rx: 0,
            tx: 0
        }
    }
}

const domain = (state = initialState, action) => {
    switch (action.type) {
        case 'CHECK_DOMAIN': {
            const valid = action.result.status === 0
            return {
                ...state,
                sourceHost: action.domain,
                valid,
                connect: {
                    activeStep: valid ? state.connect.activeStep + 1 : state.connect.activeStep
                }
            }
        }
        case 'BACK_CONNECT_DOMAIN': {
            return {
                ...state,
                connect: {
                    activeStep: state.connect.activeStep > 0 ? state.connect.activeStep - 1 : state.connect.activeStep
                }
            }
        }
        case 'CREATE_DOMAIN': {
            return {
                ...state,
                id: action.result.data.id
            }
        }
        case 'FETCH_DOMAIN': {
            const detail = action.result
            return {
                ...state,
                detail: {
                    id: detail.id,
                    state: detail.state,
                    sourceHost: detail.source_host,
                    destHost: detail.dest_host,
                    renewalDate: detail.renewal_date,
                    flux: detail.flux
                }
            }
        }
        default:
            return state
    }
}

export default domain