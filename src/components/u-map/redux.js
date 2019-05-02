//
// Action
//
import { ENV } from '../../../environments/environments';

const TOOLTIP = {
  GET: {
    REQUEST: 'TOOLTIP_GET_REQUEST',
    SUCCESS: 'TOOLTIP_GET_SUCCESS',
    FAILURE: 'TOOLTIP_GET_FAILURE',
  }
};

const TOGGLE = {
  TOOLTIP: 'TOGGLE_TOOLTIP',
  CONTEXT_MENU: 'TOGGLE_CONTEXT_MENU',
  DOT_CREATOR: 'TOGGLE_DOT_CREATOR',
  CLOUDS: 'TOGGLE_CLOUDS'
};

const DOT_PAGE = {
  SET_ID: 'DOT_PAGE_SET_ID'
};

export const toggleTooltip = (enable, id, position = {}) => async (dispatch, getState) => {
  if (enable) {
    dispatch({ type: TOOLTIP.GET.REQUEST });

    try {
      const type = 'dot';
      const item = await _getById(id, type, dispatch);

      dispatch({
        type: TOOLTIP.GET.SUCCESS,
        payload: {
          item,
          position
        }
      });

      dispatch({
        type: TOGGLE.TOOLTIP,
        payload: true
      });
    } catch (e) {
      dispatch({ type: TOOLTIP.GET.FAILURE });
    }
  } else {
    dispatch({
      type: TOGGLE.TOOLTIP,
      payload: false
    })
  }
};

const _getById = async (id, type, dispatch) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/${type}s/${id}`, {
    headers: {
      'Token': localStorage.token
    }
  });

  if (!response.ok) {
    if (response.status === 401) location.reload();
    return dispatch({ type: TOOLTIP.GET.FAILURE });
  }

  return await response.json();
};

export const toggleContextMenu = (isVisible, position = {}) => {
  return {
    type: TOGGLE.CONTEXT_MENU,
    payload: {
      isVisible,
      position
    }
  }
};

export const toggleDotCreator = (isVisible, position = {}) => {
  return {
    type: TOGGLE.DOT_CREATOR,
    payload: {
      isVisible,
      position
    }
  }
};

export const setCloudsVisibility = (visibility = {}) => {
  return {
    type: TOGGLE.CLOUDS,
    payload: {
      visibility
    }
  }
};

export const setCurrentDotId = (dotId) => (dispatch, getState) => {
  if (!dotId) history.pushState(null, null, ENV[window.ENV].static);

  dispatch({
    type: DOT_PAGE.SET_ID,
    payload: dotId
  });
};

//
// Reducer
//
export const map = (state = {
  tooltip: {
    isVisible: false,
    isFetching: false,
    item: {},
    position: {},
  },

  contextMenu: {
    isVisible: false,
    position: {}
  },

  dotCreator: {
    isVisible: false,
    position: {}
  },

  clouds: {
    visibility: 'none'
  },

  dotPage: { currentDotId: '', isVisible: false },
}, action) => {
  switch (action.type) {
    case TOOLTIP.GET.REQUEST:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          isFetching: true

        }
      };

    case TOOLTIP.GET.SUCCESS:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          isFetching: false,
          item: action.payload.item,
          position: action.payload.position
        }
      };

    case TOOLTIP.GET.FAILURE:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          isFetching: false
        }
      };

    case TOGGLE.TOOLTIP:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          isVisible: action.payload
        }
      };

    case TOGGLE.CONTEXT_MENU:
      return {
        ...state,
        contextMenu: {
          ...state.contextMenu,
          isVisible: action.payload.isVisible,
          position: action.payload.position
        }
      };

    case TOGGLE.DOT_CREATOR:
      return {
        ...state,
        dotCreator: {
          ...state.dotCreator,
          isVisible: action.payload.isVisible,
          position: action.payload.position
        }
      };

    case TOGGLE.CLOUDS:
      return {
        ...state,
        clouds: {
          ...state.clouds,
          visibility: action.payload.visibility
        }
      };

    case DOT_PAGE.SET_ID:
      return {
        ...state,
        dotPage: {
          isVisible: Boolean(action.payload),
          currentDotId: action.payload
        }
      };

    default:
      return state;
  }
};
