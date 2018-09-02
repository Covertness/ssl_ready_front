import { combineReducers } from 'redux'
import domain from './domain'
import loading from './loading'
import alert from './alert'

export default combineReducers({
    domain,
    loading,
    alert
})