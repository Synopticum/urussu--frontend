//
// Action
//
import { ENV } from '../../../environments/environments';
import { setCurrentDotId } from '../u-map/redux';

export const PAGE = {
  UPDATE: 'PAGE_UPDATE'
};

export const USER = {
  GET: 'USER_GET'
};

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? '/' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
};

const loadPage = (page) => async (dispatch, getState) => {
  await import('../u-map/u-map.js');

  import('../u-context-menu/u-context-menu.js');
  import('../u-textbox/u-textbox.js');
  import('../u-textarea/u-textarea.js');
  import('../u-round-button/u-round-button.js');
  import('../u-tooltip/u-tooltip.js');

  import('../u-dot/u-dot.js');
  import('../u-dot-creator/u-dot-creator.js');

  import('../u-comments/u-comments.js');
  import('../u-comment/u-comment.js');

  switch (true) {
    case (page === '/'):
      break;

    case (/^(dots)\/(.+)$/.test(page)):
      dispatch(setCurrentDotId(page.split('/')[1]));
      break;

    case (page === 'success'):
      // do nothing
      break;

    default:
      page = '404';
      import('../u-404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: PAGE.UPDATE,
    payload: {
      page
    }
  };
};

export const getUserInfo = () => async (dispatch, getState) => {
  let response = await fetch(`${ENV[window.ENV].api}/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Token': localStorage.token
    }
  });
  const info = await response.json();

  dispatch({
    type: USER.GET,
    payload: {
      ...info,
      isAdmin: info.role === 'admin'
    }
  });
};