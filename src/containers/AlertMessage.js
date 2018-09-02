import { connect } from 'react-redux'
import AlertDialog from '../components/AlertDialog'
import {hideAlert} from '../actions'

const mapStateToProps = ({alert}) => {
    return alert
}

const mapDispatchToProps = dispatch => {
    return {
        handleClose: () => {
            dispatch(hideAlert())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog)