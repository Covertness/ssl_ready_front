import { connect } from 'react-redux'
import Domain from '../components/Domain'
import { fetchDomain } from '../actions'

const mapStateToProps = ({ domain }) => {
    return { domain: domain.detail }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchDomain: (id) => {
            dispatch(fetchDomain(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Domain)