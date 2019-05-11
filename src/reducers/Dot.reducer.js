import {DotConstants} from "../components/u-dot/UDot.actions";
import {
    generateInProgressActionTypeName,
    generateSuccessActionTypeName,
    generateErrorActionTypeName,
} from "../middleware/asyncActionsMiddleware";

export const dotPage = (state = {
    dot: {},
    isFetching: false,
    isUpdating: false,
    isLoadingError: false
}, action) => {
    switch (action.type) {
        // GET
        case generateInProgressActionTypeName(DotConstants.FETCH):
            return {
                ...state,
                isFetching: true
            };

        case generateSuccessActionTypeName(DotConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(DotConstants.FETCH):
            return {
                ...state,
                isFetching: false,
                isLoadingError: true
            };

        // PUT
        case generateInProgressActionTypeName(DotConstants.PUT):
            return {
                ...state,
                isUpdating: true,
                dotToBeUpdated: action.payload
            };

        case generateSuccessActionTypeName(DotConstants.PUT):
            return {
                ...state,
                isUpdating: false,
                dot: action.payload
            };

        case generateErrorActionTypeName(DotConstants.PUT):
            return {
                ...state,
                isUpdating: false
            };

        case DotConstants.CLEAR_STATE:
            return {
                dot: {},
                isFetching: false,
                isUpdating: false
            };

        default:
            return state;
    }
};