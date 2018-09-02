import { connect } from 'react-redux'
import Connect from '../components/Connect'
import { checkDomain, backConnectDomain, createDomain, alertMessage } from '../actions'

const mapStateToProps = ({ domain }) => {
    return { domain }
}

const mapDispatchToProps = dispatch => {
    return {
        checkDomain: (domain) => {
            dispatch(checkDomain(domain))
        },
        handleBack: () => {
            dispatch(backConnectDomain())
        },
        createDomain: (domain, address) => {
            dispatch(createDomain(domain, address))
        },
        alertMessage: (title, content) => {
            dispatch(alertMessage(title, content))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Connect)