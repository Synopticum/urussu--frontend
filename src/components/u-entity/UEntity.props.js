export default {
    areCommentsVisible: {
        type: Boolean,
        attribute: false
    },

    areControlsVisible: {
        type: Boolean,
        attribute: false
    },

    isSpinnerVisible: {
        type: Boolean,
        attribute: false
    },

    _comments: {
        type: Array,
        attribute: false
    },

    _user: {
        type: Object,
        attribute: false
    },

    _activeImage: {
        type: String,
        attribute: false
    },

    _activeYear: {
        type: String,
        attribute: false
    },

    _isFetching: {
        type: Boolean,
        attribute: false
    },

    _isUpdating: {
        type: Boolean,
        attribute: false
    },

    _isLoadingError: {
        type: Boolean,
        attribute: false
    }
};