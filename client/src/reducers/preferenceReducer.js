import {
    FETCH_COLOR,
    EDIT_COLOR
} from "../actions/types";

export default (state = { color: '#00000'}, action) => {
    switch (action.type) {
        case FETCH_COLOR:
            return {...state, ['color']: action.payload};
        case EDIT_COLOR:
            return {...state, ['color']: action.payload};
        default:
            return state;
    }
};
