import { connect } from 'react-redux'
import App from '../components/App'

const mapStateToProps = ({loading}) => {
    return {loading}
}

const mapDispatchToProps = _dispatch => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)