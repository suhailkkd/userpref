import {combineReducers} from "redux";
import authReducer from "./authReducer";
import preferenceReducer from "./preferenceReducer";

export default combineReducers({
    auth: authReducer,
    preference: preferenceReducer
});
